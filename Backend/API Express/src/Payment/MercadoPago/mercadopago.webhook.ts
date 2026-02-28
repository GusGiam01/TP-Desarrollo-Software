import type { Request, Response } from "express";
import crypto from "crypto";
import { orm } from "../../shared/db/orm.js";
import { Order } from "../../Order/order.entity.js";

const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || "";
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

function extractPaymentId(req: Request): string | null {
  const b: any = req.body;

  const id1 = b?.data?.id ?? b?.id;

  if (id1 !== undefined && id1 !== null) return String(id1);

  const q: any = req.query;
  const id2 = q?.["data.id"] ?? q?.id;
  if (id2 !== undefined && id2 !== null) return String(id2);

  const resource: string | undefined = b?.resource;
  if (resource && typeof resource === "string") {
    const m = resource.match(/\/payments\/(\d+)/);
    if (m?.[1]) return m[1];
  }

  return null;
}

function verifyWebhookSignature(req: Request, dataId: string): boolean {
  if (!WEBHOOK_SECRET) return true; 

  const signature = req.header("x-signature");
  const requestId = req.header("x-request-id");
  if (!signature || !requestId) return false;

  const parts = signature.split(",").map(p => p.trim());
  const ts = parts.find(p => p.startsWith("ts="))?.split("=")[1];
  const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(
    a as unknown as Uint8Array,
    b as unknown as Uint8Array
  );
}

/* Consulta el pago en MP */
async function getPayment(paymentId: string) {
  if (!MP_ACCESS_TOKEN) throw new Error("Falta MP_ACCESS_TOKEN en el .env");

  const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const data = await r.json().catch(() => null);

  if (!r.ok) {
    const msg = data?.message || `Error consultando payment ${paymentId}`;
    throw new Error(msg);
  }

  return data; 
}

export const mercadopagoWebhook = async (req: Request, res: Response) => {
  try {
    console.log("MP webhook received - headers:", JSON.stringify(req.headers));
    console.log("MP webhook received - body:", JSON.stringify(req.body));

    const paymentId = extractPaymentId(req);
    console.log("MP webhook extracted paymentId:", paymentId);

    if (!paymentId) {
      console.warn("MP webhook: no paymentId found in payload - ignoring");
      return res.status(200).send("ok");
    }

    const sigOk = verifyWebhookSignature(req, paymentId);
    console.log("MP webhook signature verified:", sigOk);
    if (!sigOk) {
      console.warn("MP webhook: signature invalid (x-signature or x-request-id missing or mismatch)");
      return res.status(401).send("invalid signature");
    }

    const payment = await getPayment(paymentId);

    const status: string = payment?.status; 
    const externalReference: string | undefined = payment?.external_reference;

    if (!externalReference) {
      return res.status(200).send("ok");
    }

    const orderId = String(externalReference);

    const em = orm.em.fork();

    await em.transactional(async (tx) => {
      const order = await tx.findOne(
        Order,
        { id: orderId },
        { populate: ["linesOrder.product", "user"] } as any
      );

      if (!order) return;

      if ((order as any).statusHistory?.includes("PAID")) return;

      if (status === "approved") {
        (order as any).mpPaymentId = String(paymentId);
        (order as any).statusHistory = [...(order as any).statusHistory, "PAID"];
        (order as any).paidAt = new Date();

        for (const lo of (order as any).linesOrder ?? []) {
          const product = lo.product;
          const qty = Number(lo.quantity) || 0;
          if (!product) continue;
          const currentStock = Number((product as any).stock ?? 0);
          if (qty <= 0) continue;
          if (currentStock < qty) {
            throw new Error(`Stock insuficiente para producto ${product.id}`);
          }
          (product as any).stock = currentStock - qty;
          tx.persist(product);
        }

        tx.persist(order);
      } else if (status === "pending" || status === "in_process") {
        (order as any).statusHistory = [...(order as any).statusHistory, "PENDING_PAYMENT1"];
        (order as any).mpPaymentId = String(paymentId);
        tx.persist(order);
      } else if (status === "rejected" || status === "cancelled") {
        (order as any).statusHistory = [...(order as any).statusHistory, "PAYMENT_FAILED"];
        (order as any).mpPaymentId = String(paymentId);
        tx.persist(order);
      }
    });

    console.log("MP webhook processed OK for paymentId:", paymentId);
    return res.status(200).send("ok");
  } catch (err: any) {
    console.error("MP webhook error:", err?.message ?? err);

    // return res.status(500).send("error");
    return res.status(200).send("ok");
  }
};