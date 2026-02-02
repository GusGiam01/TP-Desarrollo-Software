import { Router } from "express";
import { createPreference } from "./mercadopago.controller.js";
import { mercadopagoWebhook } from "./mercadopago.webhook.js";
import { getOrderPaymentStatus } from "./mercadopago.controller.js";

const router = Router();

router.post("/preference", createPreference);

router.post("/webhook", mercadopagoWebhook);

router.get("/orders/:orderId/status", getOrderPaymentStatus);

export default router;
