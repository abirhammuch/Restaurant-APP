import mongoose from "mongoose";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

const getThreadByUser = async (userId, guestId) => {
  const query = {};
  if (userId) query.userId = userId;
  if (guestId) query.guestId = guestId;
  return await chatModel.findOne(query);
};

const createOrUpdateThread = async ({
  userId,
  guestId,
  userName,
  userEmail,
  message,
  from,
}) => {
  const query = {};
  if (userId) query.userId = userId;
  if (guestId) query.guestId = guestId;

  let thread = await chatModel.findOne(query);
  const isCustomerMessage = from === "customer";

  if (!thread) {
    thread = new chatModel({
      userId,
      guestId,
      userName,
      userEmail,
      messages: [message],
      unreadCount: isCustomerMessage ? 1 : 0,
      customerUnreadCount: isCustomerMessage ? 0 : 1,
      updatedAt: message.createdAt,
    });
  } else {
    thread.messages.push(message);
    thread.updatedAt = message.createdAt;
    if (isCustomerMessage) {
      if (!thread.userId || !thread.guestId || guestId) {
        thread.unreadCount += 1;
      }
    } else {
      thread.customerUnreadCount += 1;
    }
  }
  await thread.save();
  return thread;
};

const getChatThreads = async (req, res) => {
  try {
    const threads = await chatModel.find().sort({ updatedAt: -1 });
    res.json({ success: true, threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChatThread = async (req, res) => {
  try {
    const { guestId } = req.query;
    const userId = req.userId;
    const thread = await getThreadByUser(userId, guestId);
    if (!thread) {
      return res.json({ success: true, thread: null });
    }
    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const customerSendMessage = async (req, res) => {
  try {
    const { text, guestId } = req.body;
    const userId = req.userId;
    let user = {};

    if (userId) {
      user = (await userModel.findById(userId).select("name email")) || {};
    }

    const message = {
      from: "customer",
      text,
      createdAt: new Date().toISOString(),
    };

    const thread = await createOrUpdateThread({
      userId,
      guestId,
      userName: user.name || "Guest",
      userEmail: user.email || "guest@chat.local",
      message,
      from: "customer",
    });

    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminSendMessage = async (req, res) => {
  try {
    const { threadId, text } = req.body;
    if (!threadId) {
      return res
        .status(400)
        .json({ success: false, message: "Thread ID is required" });
    }

    const thread = await chatModel.findById(threadId);
    if (!thread) {
      return res
        .status(404)
        .json({ success: false, message: "Thread not found" });
    }

    const message = {
      from: "admin",
      text,
      createdAt: new Date().toISOString(),
    };

    thread.messages.push(message);
    thread.customerUnreadCount += 1;
    thread.updatedAt = message.createdAt;
    await thread.save();

    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markThreadRead = async (req, res) => {
  try {
    const { threadId } = req.body;
    if (!threadId) {
      return res
        .status(400)
        .json({ success: false, message: "Thread ID is required" });
    }

    const thread = await chatModel.findById(threadId);
    if (!thread) {
      return res
        .status(404)
        .json({ success: false, message: "Thread not found" });
    }

    thread.unreadCount = 0;
    await thread.save();

    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getChatThreads,
  getChatThread,
  customerSendMessage,
  adminSendMessage,
  markThreadRead,
};
