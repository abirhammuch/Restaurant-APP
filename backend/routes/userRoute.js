// routes/userRoute.js
import express from "express";
import {
  userLogin,
  userRegister,
  googleAuth,
  adminLogin,
  requestPasswordReset,
  resetPasswordWithOtp,
  changePassword,
  getUserCount,
  getAllUsers,
  getUser,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.post("/google-auth", googleAuth);
userRouter.post("/admin/login", adminLogin);
userRouter.post("/forgot-password", requestPasswordReset);
userRouter.post("/reset-password", resetPasswordWithOtp);

// Admin routes
userRouter.get("/count", adminAuth, getUserCount);
userRouter.get("/all", adminAuth, getAllUsers);

// User routes (authenticated)
userRouter.get("/profile", userAuth, getUser);
userRouter.put("/change-password", userAuth, changePassword);

export default userRouter;
