import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object, default: {} },
    isSubscribe: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const userModel =
  mongoose.models.menuuser || mongoose.model("menuuser", userSchema);

export default userModel;
