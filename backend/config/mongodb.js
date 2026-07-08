// config/mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');

    // ✅ Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ DB connected');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🖥️ Host: ${mongoose.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ DB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ DB disconnected');
    });

    // ✅ Remove deprecated options - Mongoose 7+ handles these automatically
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify MONGODB_URI in .env file');
    console.log('3. For Atlas: Whitelist your IP');
    console.log('4. Try using local MongoDB: mongodb://localhost:27017/digital-menu');
    process.exit(1);
  }
};

export default connectDB;