// routes/chapaRoute.js
import express from "express";
import {
  initiateChapaPayment,
  verifyChapaPayment,
  chapaWebhook,
  getPaymentStatus,
} from "../controllers/chapaController.js";
import userAuth from "../middleware/userAuth.js";

const chapaRouter = express.Router();

// ✅ User routes
chapaRouter.post("/initiate", userAuth, initiateChapaPayment);
chapaRouter.get("/verify", verifyChapaPayment);
chapaRouter.get("/status/:orderId", userAuth, getPaymentStatus);

// ✅ Webhook (no auth required - Chapa calls this)
chapaRouter.post("/webhook", chapaWebhook);

export default chapaRouter;
