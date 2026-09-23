// controllers/userController.js
import axios from "axios";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const createMailer = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

// ✅ User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const usertoken = createToken(user._id);
      res.json({
        success: true,
        usertoken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ User Register
const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (min 8 characters)",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    const user = await newUser.save();
    const usertoken = createToken(user._id);

    res.json({
      success: true,
      usertoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Google Login / Register
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const verifyResponse = await axios.get(googleVerifyUrl);
    const googleData = verifyResponse.data;

    if (!googleData || googleData.email_verified !== "true") {
      return res.status(400).json({
        success: false,
        message: "Google account verification failed",
      });
    }

    const { email, name, sub: googleId } = googleData;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email is required",
      });
    }

    let user = await userModel.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
      }
      user.name = name || user.name;
      await user.save();
    } else {
      user = await userModel.create({
        name,
        email,
        googleId,
        provider: "google",
      });
    }

    const usertoken = createToken(user._id);
    res.json({
      success: true,
      usertoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Google auth error:",
      error.response?.data || error.message || error,
    );
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error_description ||
        error.response?.data?.error ||
        error.message ||
        "Google authentication failed",
    });
  }
};

// ✅ Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // ✅ Better token generation
      const admintoken = jwt.sign(
        { id: "admin", email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.json({
        success: true,
        admintoken,
        message: "Admin login successful",
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email?.toString().trim().toLowerCase();
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: "If the account exists, an OTP has been sent",
      });
    }

    const mailer = createMailer();
    if (!mailer) {
      return res
        .status(503)
        .json({ success: false, message: "Email service is not configured" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.passwordResetOtpHash = hashOtp(otp);
    user.passwordResetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "Your Digital Menu password reset OTP",
      text: `Your password reset OTP is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
      html: `<p>Your password reset OTP is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`,
    });

    res.json({
      success: true,
      message: "If the account exists, an OTP has been sent",
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res
      .status(500)
      .json({ success: false, message: "Unable to send reset email" });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const email = req.body.email?.toString().trim().toLowerCase();
    const otp = req.body.otp?.toString().trim();
    const newPassword = req.body.newPassword?.toString();

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, OTP, and new password are required",
        });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const user = await userModel.findOne({ email });
    const validOtp =
      user &&
      user.passwordResetOtpExpiresAt > new Date() &&
      user.passwordResetOtpHash === hashOtp(otp);
    if (!validOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.provider = "local";
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Current and new passwords are required",
        });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const user = await userModel.findById(req.userId);
    if (!user || !user.password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Use forgot password to set a password for this account",
        });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get User Count (For Dashboard)
const getUserCount = async (req, res) => {
  try {
    const count = await userModel.countDocuments({
      $or: [{ role: "user" }, { role: { $exists: false } }],
    });
    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get user count error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({
        $or: [{ role: "user" }, { role: { $exists: false } }],
      })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single User
const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
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
};
