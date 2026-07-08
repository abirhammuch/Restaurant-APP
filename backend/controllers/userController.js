// controllers/userController.js
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// ✅ User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Check if user exists
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const usertoken = createToken(user._id)
      res.json({ 
        success: true, 
        usertoken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }
      })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ✅ User Register
const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    // Check if user already exists
    const exist = await userModel.findOne({ email })
    if (exist) {
      return res.json({ success: false, message: "User already exists" })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" })
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password (min 8 characters)' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Default role
    })

    const user = await newUser.save()
    const usertoken = createToken(user._id)

    res.json({ 
      success: true, 
      usertoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ✅ Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // ✅ Better token generation
      const admintoken = jwt.sign(
        { id: 'admin', email: email }, 
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      res.json({ 
        success: true, 
        admintoken,
        message: 'Admin login successful'
      })
    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ✅ Get User Count (For Dashboard)
const getUserCount = async (req, res) => {
  try {
    const count = await userModel.countDocuments({ role: 'user' })
    res.json({
      success: true,
      count
    })
  } catch (error) {
    console.error('Get user count error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ✅ Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ✅ Get Single User
const getUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await userModel.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export { 
  userLogin, 
  userRegister, 
  adminLogin,
  getUserCount,
  getAllUsers,
  getUser
}