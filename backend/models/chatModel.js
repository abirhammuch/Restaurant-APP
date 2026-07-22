import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuuser",
      sparse: true,
      index: true,
    },
    guestId: {
      type: String,
      sparse: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    customerUnreadCount: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chatModel;
