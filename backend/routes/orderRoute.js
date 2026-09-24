// routes/orderRouter.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  updateOrderStatus,
  submitTelebirrPayment,
  approveTelebirrPayment,
  getAllOrders,
  getOrderStats,
  deleteOrder,
  getOrderAnalytics,
} from "../controllers/orderController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import orderStaffAuth from "../middleware/orderStaffAuth.js";

const orderRouter = express.Router();

// ✅ User routes
orderRouter.post("/create", userAuth, createOrder);
orderRouter.get("/my-orders", userAuth, getUserOrders);
orderRouter.get("/:orderId", userAuth, getOrderDetails);
orderRouter.put("/cancel/:orderId", userAuth, cancelOrder);
orderRouter.put("/telebirr/:orderId", userAuth, submitTelebirrPayment);

// ✅ Admin routes (require admin authentication)
orderRouter.get("/admin/all", orderStaffAuth, getAllOrders);
orderRouter.get("/admin/stats", adminAuth, getOrderStats);
orderRouter.get("/admin/analytics", adminAuth, getOrderAnalytics);
orderRouter.put("/admin/status/:orderId", orderStaffAuth, updateOrderStatus);
orderRouter.put(
  "/admin/payment/approve/:orderId",
  adminAuth,
  approveTelebirrPayment,
);
orderRouter.delete("/admin/delete/:orderId", adminAuth, deleteOrder);

export default orderRouter;
