import { v2 as cloudinary } from 'cloudinary';
import foodModel from '../models/foodModel.js';

const addFood = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      ingredients, 
      preparationTime, 
      averageRating, 
      totalReviews, 
      isFast, 
      popular,
      status 
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
    }

    // Parse ingredients
    let parsedIngredients = [];
    if (ingredients) {
      parsedIngredients = ingredients.split(',').map(item => item.trim()).filter(item => item);
    }

    // Parse booleans
    const parsedIsFast = isFast === 'true' || isFast === true;
    const parsedPopular = popular === 'true' || popular === true;
    const parsedStatus = status || 'available';

    const food = new foodModel({
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      ingredients: parsedIngredients,
      images: imagesUrl,
      preparationTime: Number(preparationTime),
      averageRating: Number(averageRating) || 0,
      totalReviews: Number(totalReviews) || 0,
      status: parsedStatus,
      isFast: parsedIsFast,
      popular: parsedPopular,
      date: Date.now()
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully" });

  } catch (error) {
    console.log('Add Food Error:', error);
    res.json({ success: false, message: error.message });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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
    console.log('=== EDIT FOOD REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { 
      foodId, 
      name, 
      description, 
      price, 
      category, 
      ingredients, 
      preparationTime, 
      averageRating, 
      totalReviews,
      status,
      isFast,
      popular
    } = req.body;

    if (!foodId) {
      console.log('Food ID missing from request');
      return res.status(400).json({ 
        success: false, 
        message: "Food ID is required" 
      });
    }

    console.log('Food ID:', foodId);

    const existingFood = await foodModel.findById(foodId);
    if (!existingFood) {
      console.log('Food not found with ID:', foodId);
      return res.status(404).json({ 
        success: false, 
        message: "Food not found" 
      });
    }

    console.log('Existing food found:', existingFood.name);

    let imagesUrl = existingFood.images || [];
    
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    console.log('New images to upload:', images.length);

    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { 
            resource_type: 'image' 
          });
          return result.secure_url;
        })
      );
      console.log('Images uploaded successfully:', imagesUrl);
    }

    // Parse ingredients
    let parsedIngredients = existingFood.ingredients || [];
    if (ingredients !== undefined && ingredients !== null) {
      if (typeof ingredients === 'string') {
        parsedIngredients = ingredients.split(',').map(item => item.trim()).filter(item => item);
      } else if (Array.isArray(ingredients)) {
        parsedIngredients = ingredients;
      }
    }

    // Parse booleans
    const parsedIsFast = isFast !== undefined ? (isFast === 'true' || isFast === true) : existingFood.isFast || false;
    const parsedPopular = popular !== undefined ? (popular === 'true' || popular === true) : existingFood.popular || false;
    const parsedStatus = status || existingFood.status || 'available';

    const updateData = {
      name: name?.trim() || existingFood.name,
      description: description?.trim() || existingFood.description,
      price: price ? Number(price) : existingFood.price,
      category: category || existingFood.category,
      ingredients: parsedIngredients,
      preparationTime: preparationTime ? Number(preparationTime) : existingFood.preparationTime,
      averageRating: averageRating ? Number(averageRating) : existingFood.averageRating || 0,
      totalReviews: totalReviews ? Number(totalReviews) : existingFood.totalReviews || 0,
      status: parsedStatus,
      isFast: parsedIsFast,
      popular: parsedPopular,
    };

    if (images.length > 0) {
      updateData.images = imagesUrl;
    }

    console.log('Update Data:', updateData);

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedFood) {
      console.log('Failed to update food');
      return res.status(500).json({ 
        success: false, 
        message: "Failed to update food" 
      });
    }

    console.log('Food updated successfully:', updatedFood.name);

    res.json({ 
      success: true, 
      message: "Food updated successfully",
      food: updatedFood
    });

  } catch (error) {
    console.log('Edit food error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to update food" 
    });
  }
};

export { addFood, listFood, singleFood, removeFood, editFood };