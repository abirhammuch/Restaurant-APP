// backend/config/mongodb.js
import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  try {
    const rawMongoUri = process.env.MONGODB_URI?.trim();
    const mongoUri = rawMongoUri
      ?.replace(/^MONGODB_URI\s*=\s*/i, "")
      .replace(/^(["'])|(["'])$/g, "")
      .trim();

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Reuse existing connection in serverless / hot-reload environments
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected (reused connection)");
      return mongoose.connection;
    }

    if (connectionPromise) {
      return await connectionPromise;
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log("📡 URI:", mongoUri.replace(/\/\/.*@/, "//***:***@"));

    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    const conn = await connectionPromise;
    connectionPromise = undefined;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    connectionPromise = undefined;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(
      "\n💡 Fix: verify the MongoDB username/password in the URI and make sure your IP is allowed in Atlas Network Access.",
    );
    throw error;
  }
};

export default connectDB;
