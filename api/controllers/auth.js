import bcrypt from "bcryptjs";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const jwt_secret_key = process.env.JWT_SECRET
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    //  Check for existing user
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await db.query(checkQuery, [email, username]);
    if (checkResult.rows.length) {
      return res.status(409).json("User already exists!");
    }

    //  Hash the password
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    //  Insert the new user
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
  // res.json({ message: "User logged in successfully" });
  try {
    const { email, password } = req.body;

    //  Check for existing user
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const checkResult = await db.query(checkUserQuery, [email]);
    if (checkResult.rows.length === 0) {
      return res.status(401).json("Invalid email or password");
    }
    const hashedPassword = checkResult.rows[0].password;
    const user = checkResult.rows[0];
    // check password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json("Invalid email or password");
    }

    //  create and send token/session here
    const token = jwt.sign({ id: user.id }, jwt_secret_key, { expiresIn: "1h" });
    const { password: removed_Password, ...otherData } = checkResult.rows[0];
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Strict", // important for CSRF protection
        secure: process.env.NODE_ENV === "production", // send cookie only over HTTPS in production
      })
      .status(200)
      .json(otherData);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async() => {
  try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setCurrentUser(null);
      localStorage.removeItem("user"); // clear user data
      navigate("/login"); // redirect user to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
};
