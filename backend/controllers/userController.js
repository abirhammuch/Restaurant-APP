import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'


const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET)
}



const userLogin =  async (req,res) => {

  try {
    const {email, password} = req.body
    const user = await userModel.findOne({email})
      if(!user){
        return res.json({success:false, message:"user doesn't exist" })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if(isMatch){
        const usertoken = createToken(user._id)
        res.json({success:true, usertoken})
        
      }
      else{
        res.json({success:false, message: 'Invalid creadential'})
      }
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }

}


const userRegister =  async (req, res) => {

  try {
    const {name, email, password, confirmPassword} = req.body

    //check user is already exist

    const exist = await userModel.findOne({email})
    if(exist){
      return res.json({success:false, message:"User already exist"})
    }

    if (password !== confirmPassword) {
      return res.json({success:false, message:"Passwords do not match"})
    }

    // Validating email format  and password
    if(!validator.isEmail(email)){
        return res.json({success:false, message:'Please enter a valid email'})
    }

    if (password.length < 8) {
      return res.json({success:false,message:'Please enter a strong password'})
    }
      //hashed password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = new userModel({
        name, 
        email,
        password:hashedPassword
      })

      const user = await newUser.save()

      const usertoken = createToken(user._id)
      res.json({success:true,   usertoken})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
  
}



const adminLogin =  async (req, res ) => {

  try {
    const {email, password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const admintoken = jwt.sign(email+password, process.env.JWT_SECRET)
      res.json({success:true, admintoken})
    }
    else{
      res.json({success:false, message:"Invalid credentials"})
    }
  } catch (error) {
     console.log(error)
    res.json({success:false, message:error.message})
  }
  
}



export {userLogin, userRegister , adminLogin}