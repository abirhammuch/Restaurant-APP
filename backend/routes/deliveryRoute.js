import express from "express";
import {
  getDeliveryOrders,
  updateDeliveryOrderStatus,
} from "../controllers/deliveryController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const deliveryRouter = express.Router();

deliveryRouter.get("/orders", deliveryAuth, getDeliveryOrders);
deliveryRouter.put(
  "/orders/:orderId/status",
  deliveryAuth,
  updateDeliveryOrderStatus,
);

export default deliveryRouter;
