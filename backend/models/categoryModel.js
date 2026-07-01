import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  // Product-like fields
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
 
 
  
  // Images (like product images)
  images: {
    type: [String],
    default: []
  },
  
  // Category-specific fields
  // path: {
  //   type: String,
  //   unique: true,
  //   trim: true,
  //   lowercase: true
  // },
  
  bgColor: {
    type: String,
    default: '#FF6B35'
  },
  
  textColor: {
    type: String,
    default: '#FFFFFF'
  },
  
  // borderColor: {
  //   type: String,
  //   default: '#FF6B35'
  // },
  
  // icon: {
  //   type: String,
  //   default: '📁'
  // },
  
  // Classification
  // branch: {
  //   type: String,
  //   enum: ['gidft', 'tsom', 'both'],
  //   default: 'both'
  // },
  
  // Status
  // isActive: {
  //   type: Boolean,
  //   default: true
  // },
  
  // Display Order
  order: {
    type: Number,
    default: 0
  },
  type:{
    type: String,
  },
  // Number of products in this category
  productCount: {
    type: Number,
    default: 0
  },
  
  // Created At
  date: {
    type: Date,
    default: Date.now
  }
});


const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema)

export default categoryModel