import type { Request, Response } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { orm } from "../../shared/db/orm.js";
import { Order } from "../../Order/order.entity.js";

const FRONT_URL = process.env.FRONT_URL || "http://localhost:4200";
const API_PUBLIC_URL = process.env.API_PUBLIC_URL || "http://localhost:3000";

export const createPreference = async (req: Request, res: Response) => {
  const token = process.env.MP_ACCESS_TOKEN;
  console.log("MP token loaded?", Boolean(token), "length:", token?.length);
  if (!token) {
    return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN en el .env" });
  }

  const { orderId } = req.body as { orderId?: string };
  if (!orderId) {
    return res.status(400).json({ error: "orderId es requerido" });
  }

  try {
    // 1) Buscar order y poblar lineas + productos + user
    const em = orm.em.fork();

    const order = await em.findOne(
      Order,
      { id: orderId },
      { populate: ["linesOrder.product", "user"] } as any
    );

    if (!order) {
      return res.status(404).json({ error: "Order no encontrada" });
    }

    // 2) Armar items desde linesOrder
    const items = (order.linesOrder ?? []).map((lo: any) => {
      const product = lo.product;
      const quantity = Number(lo.quantity);

      return {
        id: String(product?.id ?? product?._id ?? "unknown"),
        title: String(product?.name ?? "Producto"),
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unit_price: Number(product?.priceUni ?? 0),
        currency_id: "ARS",
      };
    });

    if (items.length === 0) {
      return res.status(400).json({ error: "La orden no tiene líneas" });
    }

    // 3) Validar precios
    const invalid = items.find((it: any) => !Number.isFinite(it.unit_price) || it.unit_price <= 0);
    if (invalid) {
      return res.status(400).json({ error: "Hay productos sin precio válido en la orden" });
    }

    // 4) Crear preferencia Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const payerEmail = (order.user && (order.user as any).mail) ? String((order.user as any).mail) : undefined;

    console.log("FRONT_URL=", JSON.stringify(FRONT_URL));
    console.log("SUCCESS_URL=", `${FRONT_URL}/order-status?orderId=${orderId}&mpResult=success`);

    const body = {
      items,
      external_reference: String(orderId),

      ...(payerEmail ? { payer: { email: payerEmail } } : {}),

      back_urls: {
        success: `${FRONT_URL}/order-status?orderId=${orderId}&mpResult=success`,
        failure: `${FRONT_URL}/order-status?orderId=${orderId}&mpResult=failure`,
        pending: `${FRONT_URL}/order-status?orderId=${orderId}&mpResult=pending`,
      },

      auto_return: "approved",

      notification_url: `${API_PUBLIC_URL}/api/mercadopago/webhook`,
    };

    console.log("MP preference body JSON:", JSON.stringify(body, null, 2));
    console.log("FRONT_URL:", JSON.stringify(FRONT_URL));
    //console.log("MP back_urls:", body.back_urls);

    const result = await preference.create({body});

    return res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
    });
  } catch (e: any) {
    console.error("MP error raw:", e);
    console.error("MP error message:", e?.message);
    console.error("MP error cause:", e?.cause);
    console.error("MP error response:", e?.response?.data ?? e?.response);

    return res.status(500).json({
      error: e?.message ?? "Error creando preferencia",
      details: e?.response?.data ?? e?.cause ?? null,
    });
  }
};

export const getOrderPaymentStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params as { orderId?: string };
  if (!orderId) {
    return res.status(400).json({ error: "orderId es requerido" });
  }

  try {
    const em = orm.em.fork();

    const order = await em.findOne(
      Order,
      { id: orderId },
      { populate: ["linesOrder.product", "user"] } as any
    );

    if (!order) {
      return res.status(404).json({ error: "Order no encontrada" });
    }

    // Estos campos deberían ser los mismos que seteás en el webhook
    const status = (order as any).status ?? null;         // ej: "PAID" | "PENDING_PAYMENT" | ...
    const mpPaymentId = (order as any).mpPaymentId ?? null;
    const paidAt = (order as any).paidAt ?? null;

    // Total (opcional, pero útil para mostrar en el front)
    const total = ((order as any).linesOrder ?? []).reduce((acc: number, lo: any) => {
      const qty = Number(lo?.quantity ?? 0) || 0;
      const price = Number(lo?.product?.priceUni ?? 0) || 0;
      return acc + qty * price;
    }, 0);

    return res.json({
      orderId: String(orderId),
      status,
      mpPaymentId,
      paidAt,
      total,
    });
  } catch (e: any) {
    console.error("getOrderPaymentStatus error:", e?.message ?? e);
    return res.status(500).json({
      error: e?.message ?? "Error obteniendo estado de pago",
    });
  }
};
