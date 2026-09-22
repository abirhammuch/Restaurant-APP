import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "restaurant" },
    currency: { type: String, enum: ["ETB"], default: "ETB" },
    deliveryFee: { type: Number, min: 0, default: 10 },
    taxRate: { type: Number, min: 0, max: 100, default: 8 },
    freeDeliveryThreshold: { type: Number, min: 0, default: 500 },
    telebirrAccountName: { type: String, default: "marshal" },
    telebirrAccountNumber: { type: String, default: "0973769266" },
  },
  { timestamps: true },
);

const settingModel =
  mongoose.models.RestaurantSetting ||
  mongoose.model("RestaurantSetting", settingSchema);

export default settingModel;
