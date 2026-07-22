import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    // Bilingual support: store English and Amharic variants while keeping
    // legacy `name`/`description` for compatibility.
    name: { type: String, required: true },
    name_en: { type: String },
    name_am: { type: String },
    description: { type: String, required: true },
    description_en: { type: String },
    description_am: { type: String },
    price: { type: Number, required: true },

    images: { type: Array, required: true },
    category: { type: String, required: true },
    ingredients: { type: Array, required: true },
    ingredients_am: { type: Array },
    allergens: { type: Array },
    allergens_am: { type: Array },
    dietaryTags: { type: Array },
    dietaryTags_am: { type: Array },

    preparationTime: { type: Number, required: true },
    averageRating: { type: Number },
    totalReviews: { type: Number },
    isFast: { type: Boolean, default: false, required: true },
    popular: { type: Boolean, default: false, required: true },
    status: {
      type: String,
      default: "available",
      enum: ["available", "unavailable"],
    },
  },
  {
    timestamps: true,
  },
);

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
