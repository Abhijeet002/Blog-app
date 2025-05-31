import bcrypt from "bcryptjs";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwt_secret_key = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check for existing user
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await db.query(checkQuery, [email, username]);
    if (checkResult.rows.length) {
      return res.status(409).json("User already exists!");
    }

    // Hash the password
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Insert the new user
    const insertQuery =
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)";
    await db.query(insertQuery, [username, email, hash]);

    return res.status(201).json("User created successfully");
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for existing user
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const checkResult = await db.query(checkUserQuery, [email]);
    if (checkResult.rows.length === 0) {
      return res.status(401).json("Invalid email or password");
    }
    
    const hashedPassword = checkResult.rows[0].password;
    const user = checkResult.rows[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json("Invalid email or password");
    }

    // Create and send token/session
    const token = jwt.sign({ id: user.id }, jwt_secret_key, { expiresIn: "1h" });
    const { password: removed_Password, ...otherData } = checkResult.rows[0];
    
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // Fixed: Consistent sameSite
        secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
        maxAge: 3600000, // 1 hour in milliseconds
      })
      .status(200)
      .json(otherData);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true, // Added: Match the cookie settings from login
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // Fixed: Consistent sameSite
        secure: process.env.NODE_ENV === "production", // Match login settings
      })
      .status(200)
      .json("User logged out successfully");
  } catch (err) {
    console.error("Logout error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};