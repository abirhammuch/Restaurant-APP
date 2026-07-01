// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuuser",
      required: true,
    },

    // Order items
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],

    // Order totals
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // Delivery information
    deliveryAddress: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      brach: {
        type: String,
        default: "",
      },
      zipCode: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "Ethiopia",
      },
      phone: {
        type: String,
        required: true,
      },
     
    },

    // Payment information
    paymentMethod: {
      type: String,
      enum: ["cash", "telebirr", "card", "mobile_money"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: "",
    },

    // Order status
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Special instructions
    note: {
      type: String,
      default: "",
    },

    // Coupon code applied
    couponCode: {
      type: String,
      default: "",
    },

    // Table number (for dine-in)
    table: {
      type: String,
      default: "",
    },

    // Estimated delivery time
    estimatedDeliveryTime: {
      type: Date,
      default: null,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);



const orderModel =
  mongoose.models.menuorder || mongoose.model("menuorder", orderSchema);
export default orderModel;
