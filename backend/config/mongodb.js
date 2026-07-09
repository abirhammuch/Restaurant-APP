// backend/config/mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Reuse existing connection in serverless / hot-reload environments
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected (reused connection)");
      return mongoose.connection;
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log(
      "📡 URI:",
      process.env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@"),
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(
      "\n💡 Fix: verify the MongoDB username/password in the URI and make sure your IP is allowed in Atlas Network Access.",
    );
    throw error;
  }
};

export default connectDB;
