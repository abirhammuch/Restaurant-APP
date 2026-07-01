
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name:{type:String, required:true},
  description:{type:String, required:true},
  price:{type:Number, required:true},
 
  images:{type:Array, required:true},
  category:{type:String, required:true},
  ingredients:{type:Array,required:true},

  preparationTime:{type:Number, required:true},
  averageRating:{type:Number,},
  totalReviews:{type:Number, },
  isFast:{type:Boolean, default:false, required:true},
  popular:{type:Boolean, default:false, required:true},
 status:{type:String, default:"available", enum:["available","unavailable"]},
  

},
 {
    timestamps: true,
  }
)

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel