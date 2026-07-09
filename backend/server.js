// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import categoryRouter from "./routes/categoryRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import ratingRouter from "./routes/ratingRouter.js";

import mongoose from "mongoose";

// Load environment variables FIRST
dotenv.config();

// Initialize external services
connectDB();
connectCloudinary();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://restaurant-app-marshal-nine.vercel.app",
      "https://restaurant-app-gold-sigma.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "usertoken",
      "admintoken",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health Check (MUST be before other routes)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ API Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/rating", ratingRouter);

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    endpoints: {
      user: "/api/user",
      food: "/api/food",
      category: "/api/category",
      cart: "/api/cart",
      order: "/api/order",
      rating: "/api/rating",
      health: "/api/health",
    },
  });
});

app.get("/api/db-status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    status: states[state] || "unknown",
    state: state,
    database: mongoose.connection.name || "Not connected",
    host: mongoose.connection.host || "Not connected",
    message:
      state === 1
        ? "✅ Database is connected!"
        : "❌ Database is NOT connected",
  });
});

// ✅ 404 Handler - FIXED (no wildcard '*')
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ✅ Export for Vercel
export default app;

// ✅ Only start server locally
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
}
