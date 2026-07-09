// backend/config/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined');
      return;
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('📡 URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    return conn;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('\n💡 Fix: Go to MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0');
    return null;
  }
};

export default connectDB;