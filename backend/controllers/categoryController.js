// controllers/categoryController.js
import { v2 as cloudinary } from "cloudinary";
import categoryModel from "../models/categoryModel.js";
import foodModel from "../models/foodModel.js";

const defaultCategories = [
  {
    name: "Main Dishes",
    type: "food",
    bgColor: "#FF6B35",
    textColor: "#FFFFFF",
    order: 1,
    images: [],
    date: Date.now(),
  },
  {
    name: "Vegetarian",
    type: "food",
    bgColor: "#4CAF50",
    textColor: "#FFFFFF",
    order: 2,
    images: [],
    date: Date.now(),
  },
  {
    name: "Breakfast",
    type: "food",
    bgColor: "#3B82F6",
    textColor: "#FFFFFF",
    order: 3,
    images: [],
    date: Date.now(),
  },
];

const ensureDefaultCategories = async () => {
  try {
    const count = await categoryModel.countDocuments();
    if (count > 0) return [];

    await categoryModel.insertMany(defaultCategories);
    return defaultCategories;
  } catch (error) {
    console.warn("Default category seed failed:", error.message);
    return [];
  }
};

// Add Category (like addFood)
const addCategory = async (req, res) => {
  try {
    const {
      name,

      bgColor,
      textColor,
      type,

      order,
    } = req.body;

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.json({
        success: false,
        message: "Category already exists",
      });
    }

    // Handle image uploads (like product images)
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

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
                folder: "categories",
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

    const category = new categoryModel({
      name: name.trim(),

      images: imagesUrl,
      type: type,

      bgColor: bgColor || "#FF6B35",
      textColor: textColor || "#FFFFFF",

      order: order || 0,
      date: Date.now(),
    });

    await category.save();

    res.json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Categories (like listFood)
const listCategories = async (req, res) => {
  try {
    let categories = await categoryModel.find({}).sort({ order: 1, date: 1 });

    if (categories.length === 0) {
      const seededCategories = await ensureDefaultCategories();
      categories =
        seededCategories.length > 0
          ? seededCategories
          : await categoryModel.find({}).sort({ order: 1, date: 1 });
    }

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await foodModel.countDocuments({
          category: category.name,
        });
        return {
          ...category._doc,
          productCount: count,
        };
      }),
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.warn("Category list fallback triggered:", error.message);
    res.json({ success: true, categories: defaultCategories });
  }
};

// Single Category (like singleFood)
const singleCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.json({ success: true, category });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Edit Category (like editFood)
const editCategory = async (req, res) => {
  try {
    const {
      categoryId,
      name,

      bgColor,
      textColor,
      type,

      order,
    } = req.body;

    console.log("=== EDIT CATEGORY REQUEST ===");
    console.log("Category ID:", categoryId);
    console.log("Body:", req.body);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Find existing category
    const existingCategory = await categoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle image uploads
    let imagesUrl = existingCategory.images || [];

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    if (images.length > 0) {
      imagesUrl = (
        await Promise.all(
          images.map(async (item) => {
            try {
              const result = await cloudinary.uploader.upload(item.path, {
                folder: "categories",
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
    }

    // Prepare update data
    const updateData = {
      name: name?.trim() || existingCategory.name,
      type: type,

      images: imagesUrl,

      bgColor: bgColor || existingCategory.bgColor,
      textColor: textColor || existingCategory.textColor,

      order: order !== undefined ? Number(order) : existingCategory.order,
    };

    console.log("Update Data:", updateData);

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return res.status(500).json({
        success: false,
        message: "Failed to update category",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log("Edit category error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

// Remove Category (like removeFood)
const removeCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Check if category has products
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productCount = await foodModel.countDocuments({
      category: category.name,
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products assigned.`,
      });
    }

    await categoryModel.findByIdAndDelete(categoryId);

    res.json({
      success: true,
      message: "Category removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addCategory,
  listCategories,
  singleCategory,
  editCategory,
  removeCategory,
};
