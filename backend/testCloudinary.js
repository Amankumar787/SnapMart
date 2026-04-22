// backend/testCloudinary.js

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload(
"https://res.cloudinary.com/demo/image/upload/sample.jpg",
  { folder: "snapmart/test" },
  (error, result) => {
    if (error) {
      console.error("❌ Cloudinary connection failed:", error.message);
    } else {
      console.log("✅ Cloudinary working! Image uploaded:");
      console.log("   URL:", result.secure_url);
    }
  }
);