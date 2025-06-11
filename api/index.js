import express from "express";
import cookieParser from "cookie-parser";
import PostRoutes from "./routes/posts.js";
import AuthRoutes from "./routes/auth.js";
import UserRoutes from "./routes/users.js";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "./utils/cloudinary.js";
import fs from "fs";


const app = express();

const allowedOrigins = [
  "http://localhost:5173",                     // local frontend
  "https://blog-app-three-topaz.vercel.app"        // deployed vercel frontend 
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);



dotenv.config();
const port = process.env.BE_PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static("./uploads"));



// multer configuration with file validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, "-").toLowerCase());
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// upload endpoint error handling and timeout management
app.post("/uploads", upload.single("file"), async function (req, res, next) {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploading file:", req.file.filename);
    console.log("File path:", req.file.path);
    console.log("File size:", req.file.size);

    // Upload with enhanced options and timeout handling
    const uploadPromise = cloudinary.uploader.upload(req.file.path, {
      folder: "blog_uploads",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ],
      resource_type: "auto",
      timeout: 120000 // 2 minutes
    });

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout')), 120000);
    });

    // Race between upload and timeout
    const result = await Promise.race([uploadPromise, timeoutPromise]);
    
    // Clean up local file after successful upload
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.warn("Failed to cleanup local file:", cleanupError.message);
    }

    console.log("Upload successful:", result.public_id);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });

  } catch (err) {
    console.error("Upload error:", err);
    
    // Clean up local file in case of error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn("Failed to cleanup local file after error:", cleanupError.message);
      }
    }

    // Handle different error object structures
    const errorMessage = err.message || (err.error && err.error.message) || 'Unknown error';
    const errorName = err.name || (err.error && err.error.name);
    const httpCode = err.http_code || (err.error && err.error.http_code);

    // Handle specific error types
    if (errorMessage === 'Upload timeout') {
      return res.status(408).json({ error: "Upload timeout. Please try again with a smaller file." });
    }
    
    if (errorName === 'TimeoutError' || httpCode === 499) {
      return res.status(408).json({ error: "Request timeout. Please try again." });
    }
    
    if (errorMessage.includes('file type')) {
      return res.status(400).json({ error: errorMessage });
    }
    
    if (httpCode) {
      return res.status(httpCode).json({ 
        error: errorMessage || "Cloudinary upload failed" 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to upload image. Please try again." 
    });
  }
});

// Test endpoint to check if server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
  console.log("Server is working!");
});

// Import routes
app.use("/posts", PostRoutes);
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);

app.listen(port, () => {
console.log(`Server is connected and running on port ${port}`);
});