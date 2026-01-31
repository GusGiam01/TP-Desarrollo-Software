import { Router } from "express";
import { createPreference } from "./mercadopago.controller.js";

const router = Router();

router.post("/preference", createPreference);

export default router;
