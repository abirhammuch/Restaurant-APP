import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxRedemptions: {
      type: Number,
      default: 0,
      min: 0,
    },
    redemptionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menuuser",
      },
    ],
    totalDiscountBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDiscountUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const promoModel =
  mongoose.models.promocode || mongoose.model("promocode", promoSchema);
export default promoModel;
