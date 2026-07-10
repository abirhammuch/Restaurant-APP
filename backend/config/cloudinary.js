// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
  try {
    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY;

    // ✅ Debug: Log the values
    console.log('🔗 Connecting to Cloudinary...');
    console.log('📡 Cloud Name:', cloudName);
    console.log('📡 API Key:', apiKey ? 'Exists ✅' : 'Missing ❌');
    console.log('📡 API Secret:', apiSecret ? 'Exists ✅' : 'Missing ❌');

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Cloudinary credentials are missing!');
      console.log('Please check your environment variables.');
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('✅ Cloudinary connected successfully');
  } catch (error) {
    console.error('❌ Cloudinary connection error:', error);
  }
};

export default connectCloudinary;