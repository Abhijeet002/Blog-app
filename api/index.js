import express from "express";
import cookieParser from "cookie-parser";
import PostRoutes from "./routes/posts.js";
import AuthRoutes from "./routes/auth.js";
import UserRoutes from "./routes/users.js";
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
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
  console.log("Server is working!");
});
app.use("/posts", PostRoutes);
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);

app.listen(5000, () => {
  console.log(`Server is connected and running on port 5000`);
});
