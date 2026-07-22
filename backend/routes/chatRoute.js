import express from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getChatThreads,
  getChatThread,
  customerSendMessage,
  adminSendMessage,
  markThreadRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/threads", adminAuth, getChatThreads);
router.get("/thread", adminAuth, getChatThread);
router.post("/customer/send", userAuth, customerSendMessage);
router.post("/admin/send", adminAuth, adminSendMessage);
router.post("/mark-read", adminAuth, markThreadRead);

export default router;
