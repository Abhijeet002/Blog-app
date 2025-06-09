import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const addUser = (req, res) => {
  res.json({ message: "List of users from controller" });
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, image } = req.body;

    console.log("Update request for user ID:", userId);
    console.log("Request body:", req.body);

    // Validate user ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (image) {
      updates.push(`image = $${paramCount}`);
      values.push(image);
      paramCount++;
    }

    if (username) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }

    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Add user ID as the last parameter
    values.push(userId);

    const updateQuery = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, username, email, image
    `;

    console.log("Update query:", updateQuery);
    console.log("Values:", values);

    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = result.rows[0];

    console.log("User updated successfully:", updatedUser);

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({
      error: "Failed to update user profile",
      details: error.message,
    });
  }
};

// Get user profile
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const query = "SELECT id, username, email, image FROM users WHERE id = $1";
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in getUser:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const query =
      "SELECT id, username, email, image FROM users WHERE username = $1";
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in getUserByUsername:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
