// controllers/ratingController.js
import mongoose from 'mongoose'; // ✅ Add this import
import ratingModel from '../models/ratingModel.js';
import orderModel from '../models/orderModel.js';
import foodModel from '../models/foodModel.js';
import userModel from '../models/userModel.js';

// ✅ Add Rating
const addRating = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId, orderId, rating, comment, title } = req.body;

    console.log('=== ADD RATING ===');
    console.log('User ID:', userId);
    console.log('Food ID:', foodId);
    console.log('Order ID:', orderId);
    console.log('Rating:', rating);
    console.log('Comment:', comment);

    // Validate required fields
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID is required'
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if food exists
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    // Check if order exists and belongs to user
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to you'
      });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate items after the order is delivered'
      });
    }

    // Check if food is in the order
    const foodInOrder = order.items.some(item => 
      item.foodId.toString() === foodId
    );
    if (!foodInOrder) {
      return res.status(400).json({
        success: false,
        message: 'This food item was not in your order'
      });
    }

    // Check if user already rated this food in this order
    const existingRating = await ratingModel.findOne({
      orderId,
      foodId,
      userId
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this item'
      });
    }

    // Create rating
    const newRating = new ratingModel({
      userId,
      foodId,
      orderId,
      rating: Number(rating),
      comment: comment || '',
      title: title || '',
      isVerified: true,
      images: []
    });

    await newRating.save();

    // ✅ Update food average rating
    await ratingModel.updateFoodRating(foodId);

    res.json({
      success: true,
      message: 'Rating added successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get Food Ratings
const getFoodRatings = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ Fix: Use try-catch for aggregation with ObjectId
    let distribution = [];
    try {
      const objectId = new mongoose.Types.ObjectId(foodId);
      distribution = await ratingModel.aggregate([
        {
          $match: { 
            foodId: objectId, 
            isHidden: false 
          }
        },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
    } catch (aggError) {
      console.error('Distribution aggregation error:', aggError);
    }

    const [ratings, total, stats] = await Promise.all([
      ratingModel.find({ foodId, isHidden: false })
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ratingModel.countDocuments({ foodId, isHidden: false }),
      ratingModel.getAverageRating(foodId)
    ]);

    res.json({
      success: true,
      ratings,
      stats,
      distribution,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get food ratings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get User's Purchased Items (For Rating)
const getPurchasedItems = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all delivered orders
    const orders = await orderModel.find({
      userId,
      orderStatus: 'delivered'
    }).sort({ createdAt: -1 });

    // Get all ratings by this user
    const ratings = await ratingModel.find({ userId });
    const ratedFoodIds = ratings.map(r => r.foodId.toString());

    // Get all items from delivered orders that haven't been rated
    const purchasedItems = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!ratedFoodIds.includes(item.foodId.toString())) {
          purchasedItems.push({
            foodId: item.foodId,
            name: item.name,
            price: item.price,
            image: item.image || '',
            orderId: order._id,
            orderDate: order.createdAt,
            quantity: item.quantity
          });
        }
      });
    });

    res.json({
      success: true,
      purchasedItems
    });

  } catch (error) {
    console.error('Get purchased items error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Check if User Can Rate - FIXED to return full rating data
const checkCanRate = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId, orderId } = req.query;

    console.log('=== CHECK CAN RATE ===');
    console.log('User ID:', userId);
    console.log('Food ID:', foodId);
    console.log('Order ID:', orderId);

    if (!foodId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID and Order ID are required',
        canRate: false,
        ratedFoodIds: []
      });
    }

    // Check if order exists and belongs to user
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.json({
        success: true,
        canRate: false,
        message: 'Order not found',
        ratedFoodIds: []
      });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.json({
        success: true,
        canRate: false,
        message: 'Order must be delivered to rate',
        ratedFoodIds: []
      });
    }

    // Check if food is in order
    const foodInOrder = order.items.some(item => 
      item.foodId.toString() === foodId
    );
    if (!foodInOrder) {
      return res.json({
        success: true,
        canRate: false,
        message: 'Item not in order',
        ratedFoodIds: []
      });
    }

    // ✅ Get all ratings for this order and user
    const ratings = await ratingModel.find({ orderId, userId });
    const ratedFoodIds = ratings.map(r => r.foodId.toString());

    // ✅ Find the rating for the specific food
    const existingRating = ratings.find(r => r.foodId.toString() === foodId);
    const isRated = !!existingRating;

    res.json({
      success: true,
      canRate: !isRated,
      isRated: isRated,
      ratedFoodIds: ratedFoodIds,
      rating: existingRating || null, // ✅ Return full rating data
      message: isRated ? 'Already rated' : 'You can rate this item'
    });

  } catch (error) {
    console.error('Check can rate error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      canRate: false,
      ratedFoodIds: []
    });
  }
};

// ✅ Get User's Own Ratings
const getUserRatings = async (req, res) => {
  try {
    const userId = req.userId;
    
    const ratings = await ratingModel.find({ userId })
      .populate('foodId', 'name images price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      ratings
    });

  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Update Rating
const updateRating = async (req, res) => {
  try {
    const userId = req.userId;
    const { ratingId } = req.params;
    const { rating, comment, title } = req.body;

    console.log('=== UPDATE RATING ===');
    console.log('User ID:', userId);
    console.log('Rating ID:', ratingId);
    console.log('Rating:', rating);
    console.log('Comment:', comment);

    const existingRating = await ratingModel.findOne({ _id: ratingId, userId });
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    existingRating.rating = rating || existingRating.rating;
    existingRating.comment = comment !== undefined ? comment : existingRating.comment;
    existingRating.title = title !== undefined ? title : existingRating.title;
    existingRating.updatedAt = Date.now();

    await existingRating.save();

    // Update food average rating
    await ratingModel.updateFoodRating(existingRating.foodId);

    res.json({
      success: true,
      message: 'Rating updated successfully',
      rating: existingRating
    });

  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Delete Rating
const deleteRating = async (req, res) => {
  try {
    const userId = req.userId;
    const { ratingId } = req.params;

    const rating = await ratingModel.findOne({ _id: ratingId, userId });
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    const foodId = rating.foodId;
    await ratingModel.findByIdAndDelete(ratingId);

    // Update food average rating
    await ratingModel.updateFoodRating(foodId);

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });

  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Admin: Get All Ratings
const getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await ratingModel.find({})
      .populate('userId', 'name email')
      .populate('foodId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ratingModel.countDocuments();

    res.json({
      success: true,
      ratings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all ratings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Admin: Toggle Hide Rating
const toggleHideRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { isHidden } = req.body;

    const rating = await ratingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    rating.isHidden = isHidden !== undefined ? isHidden : !rating.isHidden;
    await rating.save();

    res.json({
      success: true,
      message: `Rating ${rating.isHidden ? 'hidden' : 'shown'} successfully`,
      rating
    });

  } catch (error) {
    console.error('Toggle hide rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Admin: Add Admin Response
const addAdminResponse = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { adminResponse } = req.body;

    if (!adminResponse) {
      return res.status(400).json({
        success: false,
        message: 'Admin response is required'
      });
    }

    const rating = await ratingModel.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    rating.adminResponse = adminResponse;
    await rating.save();

    res.json({
      success: true,
      message: 'Admin response added successfully',
      rating
    });

  } catch (error) {
    console.error('Add admin response error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  addRating,
  getFoodRatings,
  getUserRatings,
  getPurchasedItems,
  checkCanRate,
  updateRating,
  deleteRating,
  getAllRatings,
  toggleHideRating,
  addAdminResponse
};