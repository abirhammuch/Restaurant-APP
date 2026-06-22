
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name:{type:String, required:true},
  description:{type:String, required:true},
  price:{type:Number, required:true},
 
  images:{type:Array, required:true},
  category:{type:String, required:true},
  ingredients:{type:Array,required:true},
  allergens:{type:Array, required:true},
  dietaryTags:{type:Array, required:true},
  preparationTime:{type:Number, required:true},
  averageRating:{type:Number,},
  totalReviews:{type:Number, },
  

},
 {
    timestamps: true,
  }
)

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel