
import {v2 as cloudinary} from 'cloudinary'
import foodModel from '../models/foodModel.js'
const addFood =  async (req, res) => {

 try {
   const {name, description, price, category, ingredients, allergens, dietaryTags, preparationTime, averageRating, totalReviews} = req.body
   const image1 = req.files.image1 && req.files.image1[0]
 const image2 = req.files.image2 && req.files.image2[0]
 const image3 = req.files.image3 && req.files.image3[0]
 const image4 = req.files.image4 && req.files.image4[0]


  const images = [image1,image2, image3, image4].filter((item) => item !== undefined)


   let imagesUrl = await Promise.all(
      images.map(async (item) =>{
        let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
        return result.secure_url
      })
    )


    const food= new foodModel({
      name,
      description,
      category,
      price:Number(price),
      ingredients:ingredients.split(','),
      allergens:allergens.split(','),
      dietaryTags:dietaryTags.split(','), 
      images:imagesUrl,
      preparationTime:Number(preparationTime),
      averageRating:Number(averageRating),
      totalReviews:Number(totalReviews),
      date : Date.now()
    })

    

    await food.save()
    res.json({success: true, message: "Food added successfully"})
 } catch (error) {
  console.log(error);
  res.json({success:false, message:error.message})
  
 }
  } 



const listFood =  async (req, res) => {
try {
  const foods = await foodModel.find({})
 res.json({success:true, foods })
} catch (error) {
   console.log(error);
  res.json({success:false, message:error.message})
}
  
}



const singleFood =  async (req, res) => {
 try {
   const {foodId} = req.body
   const food = await foodModel.findById(foodId)
   res.json({success:true,food})
 } catch (error) {
  
 }
  
}


const removeFood =  async (req, res) => {
  try {
    const {foodId} = req.body
    await foodModel.findByIdAndDelete(foodId)
    res.json({success:true, message:"Food removed"})
  } catch (error) {
     console.log(error);
  res.json({success:false, message:error.message})
  }
  
}


export {addFood, listFood, singleFood, removeFood}
