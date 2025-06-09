import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  // Add timeout configurations
  timeout: 60000, // 60 seconds
  // Enable retry on failure
  retry: {
    count: 3,
    delay: 1000
  }
});

export default cloudinary;
