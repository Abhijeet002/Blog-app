// api\index.js

import express from "express";
import cookieParser from "cookie-parser";
import PostRoutes from "./routes/posts.js";
import AuthRoutes from "./routes/auth.js";
import UserRoutes from "./routes/users.js";
import multer from "multer"
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // or simply `*` during development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you need to send cookies
  })
);

// dotenv.config();
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Add this after your other middleware
app.use('/uploads', express.static('./uploads'));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() +  file.originalname.replace(/\s+/g, '-').toLowerCase())
  }
})
const upload = multer({ storage })


// Updated upload endpoint 
app.post('/uploads', upload.single('file'), function (req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log("Uploaded file info:", req.file);
  
  // Return the file information that the client needs
  res.status(200).json({ 
    message: "File uploaded successfully!",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    size: req.file.size
  });
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

app.listen(5000, () => {
  console.log(`Server is connected and running on port 5000`);
});
