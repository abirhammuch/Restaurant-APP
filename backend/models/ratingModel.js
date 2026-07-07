// models/ratingModel.js
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menuuser',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menufood',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menuorder',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  },
  title: {
    type: String,
    default: '',
    maxlength: 100
  },
  images: {
    type: [String],
    default: []
  },
  helpful: {
    type: Number,
    default: 0
  },
  adminResponse: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// ✅ Indexes
ratingSchema.index({ foodId: 1, createdAt: -1 });
ratingSchema.index({ userId: 1, foodId: 1 });
ratingSchema.index({ rating: 1 });
ratingSchema.index({ orderId: 1 });

// ✅ Ensure one rating per order item
ratingSchema.index({ orderId: 1, foodId: 1, userId: 1 }, { unique: true });

// ✅ Calculate average rating - FIXED
ratingSchema.statics.getAverageRating = async function(foodId) {
  try {
    // ✅ FIX: Use 'new' with ObjectId
    const objectId = new mongoose.Types.ObjectId(foodId);
    
    const result = await this.aggregate([
      {
        $match: { 
          foodId: objectId, 
          isHidden: false 
        }
      },
      {
        $group: {
          _id: '$foodId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews
    };
  } catch (error) {
    console.error('Get average rating error:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
};

// ✅ Update food model with rating - FIXED
ratingSchema.statics.updateFoodRating = async function(foodId) {
  try {
    const stats = await this.getAverageRating(foodId);
    const Food = mongoose.model('menufood');
    await Food.findByIdAndUpdate(foodId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
    return stats;
  } catch (error) {
    console.error('Update food rating error:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
};

const ratingModel = mongoose.models.menurating || mongoose.model('menurating', ratingSchema);
export default ratingModel;