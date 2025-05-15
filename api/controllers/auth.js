import bcrypt from "bcryptjs";
import { db } from "../db.js";
// import { use } from "react";

// export const register = (req, res) => {
//   const checkUserQuery  = "SELECT * FROM users WHERE email = $1 OR username = $2";
//   const {username, email, password} = req.body;
//   db.query(checkUserQuery , email, username, (err, data) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (data.rows.length) return res.status(409).json("User already exists!");

//     const saltRounds = 10;
//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hash = bcrypt.hashSync(password, salt);

//     const insertQuery =
//       "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
//     const values = [username, email, hash];
//     db.query(insertQuery , values, (err2,data)=>{
//       if (err2) {
//         console.error("Error creating user:", err2);
//         return res.status(500).json({ error: err2.message });
//       }
//       return res.status(200).json("User created successfully");
//     });

//   });
// };

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
    const checkUserQuery = "SELECT * FROM USERS WHERE email = $1";
    const checkResult = await db.query(checkUserQuery, [email]);
    if (checkResult.rows.length === 0) {
      return res.status(401).json("Invalid email or password");
    }
    const hashedPassword = checkResult.rows[0].password;

    // check password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json("Invalid email or password");
    }

    // Optionally: create and send token/session here
    res.status(200).json("Login successful");
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.json({ message: "User logged out successfully" });
};
