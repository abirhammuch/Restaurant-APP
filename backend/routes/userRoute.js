// routes/userRoute.js
import express from 'express'
import { 
  userLogin, 
  userRegister, 
  adminLogin,
  getUserCount,
  getAllUsers,
  getUser
} from '../controllers/userController.js'
import adminAuth from '../middleware/adminAuth.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

// Public routes
userRouter.post('/login', userLogin)
userRouter.post('/register', userRegister)
userRouter.post('/admin/login', adminLogin)

// Admin routes
userRouter.get('/count', adminAuth, getUserCount)
userRouter.get('/all', adminAuth, getAllUsers)

// User routes (authenticated)
userRouter.get('/profile', userAuth, getUser)

export default userRouter