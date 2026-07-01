


import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
  name:{type :String},
  email:{type : String, unique: true},
  password:{type:String},
  cartData:{type: Object, default:{}},
  isSubscribe:{type:Boolean, default:false}
  
  
},
{timestamps:true}
)

const userModel = mongoose.models.menuuser || mongoose.model("menuuser", userSchema)


export default userModel