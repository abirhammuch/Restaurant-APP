import { v2 as cloudinary } from "cloudinary";
import foodModel from "../models/foodModel.js";

const defaultFoods = [
  {
    name: "Classic Burger",
    description: "Juicy grilled burger with fresh toppings.",
    price: 12,
    category: "Main Dishes",
    ingredients: ["Beef", "Bun", "Lettuce"],
    images: [],
    preparationTime: 15,
    averageRating: 4.7,
    totalReviews: 24,
    status: "available",
    isFast: true,
    popular: true,
  },
  {
    name: "Veggie Pizza",
    description: "Fresh vegetable pizza with melted cheese.",
    price: 10,
    category: "Vegetarian",
    ingredients: ["Cheese", "Tomato", "Bell Pepper"],
    images: [],
    preparationTime: 20,
    averageRating: 4.5,
    totalReviews: 18,
    status: "available",
    isFast: true,
    popular: true,
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy pasta with parmesan and herbs.",
    price: 9,
    category: "Breakfast",
    ingredients: ["Pasta", "Cream", "Parmesan"],
    images: [],
    preparationTime: 12,
    averageRating: 4.6,
    totalReviews: 15,
    status: "available",
    isFast: false,
    popular: false,
  },
];

const ensureDefaultFoods = async () => {
  try {
    const count = await foodModel.countDocuments();
    if (count > 0) return [];

    await foodModel.insertMany(
      defaultFoods.map((food) => ({ ...food, date: Date.now() })),
    );
    return defaultFoods;
  } catch (error) {
    console.warn("Default food seed failed:", error.message);
    return [];
  }
};

const addFood = async (req, res) => {
  try {
    const {
      name,
      name_en,
      name_am,
      description,
      description_en,
      description_am,
      price,
      category,
      ingredients,
      ingredients_am,
      allergens,
      allergens_am,
      dietaryTags,
      dietaryTags_am,
      preparationTime,
      averageRating,
      totalReviews,
      isFast,
      popular,
      status,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = (
        await Promise.all(
          images.map(async (item) => {
            try {
              const result = await cloudinary.uploader.upload(item.path, {
                resource_type: "image",
              });
              return result?.secure_url || "";
            } catch (error) {
              console.warn(
                "Cloudinary upload failed, continuing without image:",
                error.message,
              );
              return "";
            }
          }),
        )
      ).filter(Boolean);
    }

    // Parse ingredients
    let parsedIngredients = [];
    if (ingredients) {
      parsedIngredients = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    // Parse amharic ingredients
    let parsedIngredientsAm = [];
    if (ingredients_am) {
      parsedIngredientsAm = ingredients_am
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    // Parse allergens
    let parsedAllergens = [];
    if (allergens) {
      parsedAllergens = allergens
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    let parsedAllergensAm = [];
    if (allergens_am) {
      parsedAllergensAm = allergens_am
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    // Parse dietary tags
    let parsedDietary = [];
    if (dietaryTags) {
      parsedDietary = dietaryTags
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    let parsedDietaryAm = [];
    if (dietaryTags_am) {
      parsedDietaryAm = dietaryTags_am
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    // Parse booleans
    const parsedIsFast = isFast === "true" || isFast === true;
    const parsedPopular = popular === "true" || popular === true;
    const parsedStatus = status || "available";

    const food = new foodModel({
      name: (name || name_en || name_am || "").trim(),
      name_en: (name_en || name || "").trim(),
      name_am: (name_am || name || "").trim(),
      description: (
        description ||
        description_en ||
        description_am ||
        ""
      ).trim(),
      description_en: (description_en || description || "").trim(),
      description_am: (description_am || description || "").trim(),
      category,
      price: Number(price),
      ingredients: parsedIngredients,
      ingredients_am: parsedIngredientsAm,
      allergens: parsedAllergens,
      allergens_am: parsedAllergensAm,
      dietaryTags: parsedDietary,
      dietaryTags_am: parsedDietaryAm,
      images: imagesUrl,
      preparationTime: Number(preparationTime),
      averageRating: Number(averageRating) || 0,
      totalReviews: Number(totalReviews) || 0,
      status: parsedStatus,
      isFast: parsedIsFast,
      popular: parsedPopular,
      date: Date.now(),
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log("Add Food Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const listFood = async (req, res) => {
  try {
    let foods = await foodModel.find({}).sort({ createdAt: -1 });

    if (foods.length === 0) {
      const seededFoods = await ensureDefaultFoods();
      foods =
        seededFoods.length > 0
          ? seededFoods
          : await foodModel.find({}).sort({ createdAt: -1 });
    }

    res.json({ success: true, foods });
  } catch (error) {
    console.warn("Food list fallback triggered:", error.message);
    res.json({ success: true, foods: defaultFoods });
  }
};

const singleFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const food = await foodModel.findById(foodId);
    res.json({ success: true, food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    await foodModel.findByIdAndDelete(foodId);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const editFood = async (req, res) => {
  try {
    console.log("=== EDIT FOOD REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      foodId,
      name,
      name_en,
      name_am,
      description,
      description_en,
      description_am,
      price,
      category,
      ingredients,
      ingredients_am,
      allergens,
      allergens_am,
      dietaryTags,
      dietaryTags_am,
      preparationTime,
      averageRating,
      totalReviews,
      status,
      isFast,
      popular,
    } = req.body;

    if (!foodId) {
      console.log("Food ID missing from request");
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    console.log("Food ID:", foodId);

    const existingFood = await foodModel.findById(foodId);
    if (!existingFood) {
      console.log("Food not found with ID:", foodId);
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    console.log("Existing food found:", existingFood.name);

    let imagesUrl = existingFood.images || [];

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    console.log("New images to upload:", images.length);

    if (images.length > 0) {
      imagesUrl = (
        await Promise.all(
          images.map(async (item) => {
            try {
              const result = await cloudinary.uploader.upload(item.path, {
                resource_type: "image",
              });
              return result?.secure_url || "";
            } catch (error) {
              console.warn(
                "Cloudinary upload failed during edit, continuing without image:",
                error.message,
              );
              return "";
            }
          }),
        )
      ).filter(Boolean);
      console.log("Images uploaded successfully:", imagesUrl);
    }

    // Parse ingredients
    let parsedIngredients = existingFood.ingredients || [];
    if (ingredients !== undefined && ingredients !== null) {
      if (typeof ingredients === "string") {
        parsedIngredients = ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(ingredients)) {
        parsedIngredients = ingredients;
      }
    }

    // Parse ingredients am
    let parsedIngredientsAm = existingFood.ingredients_am || [];
    if (ingredients_am !== undefined && ingredients_am !== null) {
      if (typeof ingredients_am === "string") {
        parsedIngredientsAm = ingredients_am
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(ingredients_am)) {
        parsedIngredientsAm = ingredients_am;
      }
    }

    // Parse allergens
    let parsedAllergens = existingFood.allergens || [];
    if (allergens !== undefined && allergens !== null) {
      if (typeof allergens === "string") {
        parsedAllergens = allergens
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(allergens)) {
        parsedAllergens = allergens;
      }
    }

    let parsedAllergensAm = existingFood.allergens_am || [];
    if (allergens_am !== undefined && allergens_am !== null) {
      if (typeof allergens_am === "string") {
        parsedAllergensAm = allergens_am
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(allergens_am)) {
        parsedAllergensAm = allergens_am;
      }
    }

    // Parse dietary tags
    let parsedDietary = existingFood.dietaryTags || [];
    if (dietaryTags !== undefined && dietaryTags !== null) {
      if (typeof dietaryTags === "string") {
        parsedDietary = dietaryTags
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(dietaryTags)) {
        parsedDietary = dietaryTags;
      }
    }

    let parsedDietaryAm = existingFood.dietaryTags_am || [];
    if (dietaryTags_am !== undefined && dietaryTags_am !== null) {
      if (typeof dietaryTags_am === "string") {
        parsedDietaryAm = dietaryTags_am
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (Array.isArray(dietaryTags_am)) {
        parsedDietaryAm = dietaryTags_am;
      }
    }

    // Parse booleans
    const parsedIsFast =
      isFast !== undefined
        ? isFast === "true" || isFast === true
        : existingFood.isFast || false;
    const parsedPopular =
      popular !== undefined
        ? popular === "true" || popular === true
        : existingFood.popular || false;
    const parsedStatus = status || existingFood.status || "available";

    const updateData = {
      name: name?.trim() || existingFood.name,
      name_en:
        (name_en !== undefined ? name_en.trim() : existingFood.name_en) ||
        existingFood.name,
      name_am:
        (name_am !== undefined ? name_am.trim() : existingFood.name_am) ||
        existingFood.name,
      description: description?.trim() || existingFood.description,
      description_en:
        (description_en !== undefined
          ? description_en.trim()
          : existingFood.description_en) || existingFood.description,
      description_am:
        (description_am !== undefined
          ? description_am.trim()
          : existingFood.description_am) || existingFood.description,
      price: price ? Number(price) : existingFood.price,
      category: category || existingFood.category,
      ingredients: parsedIngredients,
      ingredients_am: parsedIngredientsAm,
      allergens: parsedAllergens,
      allergens_am: parsedAllergensAm,
      dietaryTags: parsedDietary,
      dietaryTags_am: parsedDietaryAm,
      preparationTime: preparationTime
        ? Number(preparationTime)
        : existingFood.preparationTime,
      averageRating: averageRating
        ? Number(averageRating)
        : existingFood.averageRating || 0,
      totalReviews: totalReviews
        ? Number(totalReviews)
        : existingFood.totalReviews || 0,
      status: parsedStatus,
      isFast: parsedIsFast,
      popular: parsedPopular,
    };

    if (images.length > 0) {
      updateData.images = imagesUrl;
    }

    console.log("Update Data:", updateData);

    const updatedFood = await foodModel.findByIdAndUpdate(foodId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFood) {
      console.log("Failed to update food");
      return res.status(500).json({
        success: false,
        message: "Failed to update food",
      });
    }

    console.log("Food updated successfully:", updatedFood.name);

    res.json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.log("Edit food error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update food",
    });
  }
};

export { addFood, listFood, singleFood, removeFood, editFood };
