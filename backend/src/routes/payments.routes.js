import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createStripeCheckoutSession,
  stripeWebhook,
  getOrderStatusBySession,
} from "../controllers/payments.controller.js";

const router = express.Router();

// Crear sesión (usuario logueado)
router.post("/stripe/checkout-session", authMiddleware, createStripeCheckoutSession);

// Webhook: debe ser RAW (no json)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Consultar estado por session_id (público para pantalla success)
router.get("/stripe/order-status", getOrderStatusBySession);

export default router;