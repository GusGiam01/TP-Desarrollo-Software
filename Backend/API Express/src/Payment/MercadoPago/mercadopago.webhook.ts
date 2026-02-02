import type { Request, Response } from "express";
import crypto from "crypto";
import { orm } from "../../shared/db/orm.js";
import { Order } from "../../Order/order.entity.js";

/**
 * Si configuraste "Webhook secret" en el panel de MP,
 * guardalo en .env como MP_WEBHOOK_SECRET.
 *
 * Si NO lo configuraste, podés dejarlo vacío y el webhook igual procesa,
 * pero NO es lo ideal en producción.
 */
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || "";
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

/** Extrae el paymentId de distintos formatos de notificación */
function extractPaymentId(req: Request): string | null {
  const b: any = req.body;

  // Webhooks nuevos: { type: "payment", data: { id: 123 } }
  const id1 = b?.data?.id ?? b?.id;

  // A veces llega como string
  if (id1 !== undefined && id1 !== null) return String(id1);

  // IPN / otros formatos: query params
  const q: any = req.query;
  const id2 = q?.["data.id"] ?? q?.id;
  if (id2 !== undefined && id2 !== null) return String(id2);

  // Formato "resource": "https://api.mercadopago.com/v1/payments/123"
  const resource: string | undefined = b?.resource;
  if (resource && typeof resource === "string") {
    const m = resource.match(/\/payments\/(\d+)/);
    if (m?.[1]) return m[1];
  }

  return null;
}

/**
 * Validación de firma de Webhooks (opcional pero recomendado).
 * Nota: el esquema exacto puede variar según configuración/versión.
 * Si no usás secret, podés saltear esto.
 */
function verifyWebhookSignature(req: Request, dataId: string): boolean {
  if (!WEBHOOK_SECRET) return true; // sin secret => no validamos

  const signature = req.header("x-signature");
  const requestId = req.header("x-request-id");
  if (!signature || !requestId) return false;

  // x-signature viene como "ts=...,v1=..."
  const parts = signature.split(",").map(p => p.trim());
  const ts = parts.find(p => p.startsWith("ts="))?.split("=")[1];
  const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];
  if (!ts || !v1) return false;

  // Este "manifest" es el que MP suele pedir hashear.
  // Hay implementaciones públicas que usan esta misma idea.
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  // OJO: timingSafeEqual exige misma longitud
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  if (a.length !== b.length) return false;

  // TS fix: castear a ArrayBufferView/Uint8Array
  return crypto.timingSafeEqual(
    a as unknown as Uint8Array,
    b as unknown as Uint8Array
  );
}

/** Consulta el pago en MP */
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

  return data; // incluye status, external_reference, etc.
}

export const mercadopagoWebhook = async (req: Request, res: Response) => {
  // MP espera 200 rápido; si devolvés 4xx/5xx, reintenta.
  // Si algo sale mal, en prod conviene loguear y devolver 200 igual
  // SOLO si ya tenés forma de reintentar por tu cuenta.
  try {
    const paymentId = extractPaymentId(req);
    if (!paymentId) {
      return res.status(200).send("ok"); // no hay id -> no procesamos
    }

    // Validación de firma (si usás secret)
    if (!verifyWebhookSignature(req, paymentId)) {
      return res.status(401).send("invalid signature");
    }

    const payment = await getPayment(paymentId);

    const status: string = payment?.status; // approved | pending | rejected | etc.
    const externalReference: string | undefined = payment?.external_reference;

    if (!externalReference) {
      // Sin external_reference no sabemos qué order actualizar
      return res.status(200).send("ok");
    }

    // Importante: external_reference lo estás seteando como orderId (string)
    const orderId = String(externalReference);

    const em = orm.em.fork();

    await em.transactional(async (tx) => {
      const order = await tx.findOne(
        Order,
        { id: orderId },
        { populate: ["linesOrder.product", "user"] } as any
      );

      if (!order) return;

      // Idempotencia: si ya está pagada, no tocar stock de nuevo
      if ((order as any).status === "PAID") return;

      // Solo confirmamos pago cuando MP dice approved
      if (status === "approved") {
        // (Opcional) guardá el paymentId para auditoría
        (order as any).mpPaymentId = String(paymentId);
        (order as any).status = "PAID";
        (order as any).paidAt = new Date();

        // Descontar stock
        for (const lo of (order as any).linesOrder ?? []) {
          const product = lo.product;
          const qty = Number(lo.quantity) || 0;

          if (!product) continue;

          // Ajustá estos nombres a tu entidad Product
          const currentStock = Number((product as any).stock ?? 0);

          if (qty <= 0) continue;
          if (currentStock < qty) {
            // Si querés, marcá la orden como "PAID_BUT_NO_STOCK" o dispará compensación
            throw new Error(`Stock insuficiente para producto ${product.id}`);
          }

          (product as any).stock = currentStock - qty;
          tx.persist(product);
        }

        tx.persist(order);
      } else {
        // Opcional: guardar estados intermedios
        // pending -> "PENDING_PAYMENT"
        // rejected/cancelled -> "PAYMENT_FAILED"
        if (status === "pending" || status === "in_process") {
          (order as any).status = "PENDING_PAYMENT";
          (order as any).mpPaymentId = String(paymentId);
          tx.persist(order);
        }
        if (status === "rejected" || status === "cancelled") {
          (order as any).status = "PAYMENT_FAILED";
          (order as any).mpPaymentId = String(paymentId);
          tx.persist(order);
        }
      }
    });

    return res.status(200).send("ok");
  } catch (err: any) {
    console.error("MP webhook error:", err?.message ?? err);

    // En producción, muchas integraciones devuelven 200 para evitar reintentos
    // si ya manejan retries internamente. Si preferís que MP reintente:
    // return res.status(500).send("error");
    return res.status(200).send("ok");
  }
};
