// api\controllers\posts.js
import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Base query builder for posts with user information
const getBasePostQuery = (whereClause = "", orderBy = "p.date DESC") => {
  return `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.img,
      p.category,
      p.date,
      p.uid,
      u.username AS author_username,
      u.image AS author_img,
      u.email AS author_email
    FROM posts p
    LEFT JOIN users u ON p.uid = u.id
    ${whereClause ? `WHERE ${whereClause}` : ""}
    ORDER BY ${orderBy}
  `;
};

// Helper function to execute post queries
const executePostQuery = async (
  whereClause = "",
  values = [],
  orderBy = "p.date DESC"
) => {
  const query = getBasePostQuery(whereClause, orderBy);
  return await db.query(query, values);
};

export const getPostByCategory = async (req, res) => {
  const category = req.params.category?.trim().toLowerCase();

  try {
    console.log(`Fetching posts for category: ${category}`);

    let result;
    if (category) {
      result = await executePostQuery("p.category = $1", [category]);
    } else {
      result = await executePostQuery();
    }

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this category" });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching posts by category:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const result = await executePostQuery();

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSinglePost = async (req, res) => {
  const postId = req.params.id;

  try {
    console.log(`Fetching post with ID: ${postId}`);

    const result = await executePostQuery("p.id = $1", [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Found post with title:", result.rows[0].title);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching single post:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const jwt_secret_key = process.env.JWT_SECRET;

    if (!accessToken) {
      return res.status(401).json({ error: "Not Authenticated" });
    }

    if (!jwt_secret_key) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const verifyToken = (token, secret) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
    };

    // Verify JWT token
    let userInfo;
    try {
      userInfo = await verifyToken(accessToken, jwt_secret_key);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const postId = req.params.id;

    // Validate post ID
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Check if post exists and get post details
    const checkQuery = "SELECT id, uid, title FROM posts WHERE id = $1";
    const checkResult = await db.query(checkQuery, [postId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = checkResult.rows[0];

    // Check if user owns the post
    if (post.uid !== userInfo.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts" });
    }

    // Delete the post
    const deleteQuery = "DELETE FROM posts WHERE id = $1 AND uid = $2";
    const deleteResult = await db.query(deleteQuery, [postId, userInfo.id]);

    if (deleteResult.rowCount === 0) {
      return res.status(500).json({ error: "Failed to delete post" });
    }

    console.log(
      `Post deleted successfully: ID ${postId}, Title: "${post.title}"`
    );
    return res.status(200).json({
      message: "Post deleted successfully",
      deletedPost: {
        id: post.id,
        title: post.title,
      },
    });
  } catch (err) {
    console.error("Error in deletePost:", err);

    // Handle specific error types
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token format" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    } else if (err.code && err.code.startsWith("22")) {
      return res.status(400).json({ error: "Invalid data format" });
    } else if (err.code && err.code.startsWith("23")) {
      return res.status(409).json({ error: "Database constraint violation" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addPost = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const jwt_secret_key = process.env.JWT_SECRET;

    if (!accessToken) {
      return res.status(401).json({ error: "Not Authenticated" });
    }

    if (!jwt_secret_key) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const verifyToken = (token, secret) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
    };

    // Verify JWT token
    let userInfo;
    try {
      userInfo = await verifyToken(accessToken, jwt_secret_key);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const { title, category, description, img } = req.body; // 

    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({
        error: "Title, category, and description are required", //  error message
        missing: {
          title: !title,
          category: !category,
          description: !description, 
        },
      });
    }

    // Validate field lengths
    if (title.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be at least 3 characters long" });
    }

    if (description.trim().length < 10) {
      
      return res
        .status(400)
        .json({ error: "Description must be at least 10 characters long" }); // Updated error message
    }

    // Insert new post into database
    const insertQuery = `
      INSERT INTO posts (title, description, img, category, date, uid)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
      RETURNING id, title, description, img, category, date, uid
    `;

    const insertResult = await db.query(insertQuery, [
      title.trim(),
      description.trim(), 
      img || null,
      category.trim(),
      userInfo.id,
    ]);

    if (insertResult.rowCount === 0) {
      return res.status(500).json({ error: "Failed to create post" });
    }

    const newPost = insertResult.rows[0];

    // Get user information for the response
    const userQuery = "SELECT username, image, email FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [userInfo.id]);

    const postWithAuthor = {
      ...newPost,
      author_username: userResult.rows[0]?.username,
      author_img: userResult.rows[0]?.image,
      author_email: userResult.rows[0]?.email,
    };

    console.log(
      `Post created successfully: ID ${newPost.id}, Title: "${newPost.title}" by user ${userInfo.id}`
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: postWithAuthor,
    });
  } catch (err) {
    console.error("Error in addPost:", err);

    // Handle specific error types
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token format" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    } else if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "A post with this title already exists" });
    } else if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Invalid user or category reference" });
    } else if (err.code && err.code.startsWith("22")) {
      return res.status(400).json({ error: "Invalid data format" });
    } else if (err.code && err.code.startsWith("23")) {
      return res.status(409).json({ error: "Database constraint violation" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const jwt_secret_key = process.env.JWT_SECRET;

    if (!accessToken) {
      return res.status(401).json({ error: "Not Authenticated" });
    }

    if (!jwt_secret_key) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const verifyToken = (token, secret) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
    };

    // Verify JWT token
    let userInfo;
    try {
      userInfo = await verifyToken(accessToken, jwt_secret_key);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const postId = req.params.id;
    const { title, category, description, img } = req.body;

    // Validate post ID
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({
        error: "Title, category, and description are required", // Updated error message
        missing: {
          title: !title,
          category: !category,
          description: !description,
        },
      });
    }

    // Validate field lengths
    if (title.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be at least 3 characters long" });
    }

    if (description.trim().length < 10) {
      return res
        .status(400)
        .json({ error: "Description must be at least 10 characters long" });
    }

    // Check if post exists and user owns it
    const checkQuery = "SELECT id, uid, title FROM posts WHERE id = $1";
    const checkResult = await db.query(checkQuery, [postId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = checkResult.rows[0];

    // Check if user owns the post
    if (post.uid !== userInfo.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own posts" });
    }

    // Check for duplicate title 
    const duplicateCheckQuery =
      "SELECT id FROM posts WHERE LOWER(title) = LOWER($1) AND id != $2";
    const duplicateResult = await db.query(duplicateCheckQuery, [
      title.trim(),
      postId,
    ]);

    if (duplicateResult.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "A post with this title already exists" });
    }

    // Update the post
    const updateQuery = `
      UPDATE posts 
      SET title = $1, description = $2, img = $3, category = $4, date = CURRENT_TIMESTAMP
      WHERE id = $5 AND uid = $6
      RETURNING id, title, description, img, category, date, uid
    `;

    const updateResult = await db.query(updateQuery, [
      title.trim(),
      description.trim(), 
      img || null,
      category.trim(),
      postId,
      userInfo.id,
    ]);

    if (updateResult.rowCount === 0) {
      return res.status(500).json({ error: "Failed to update post" });
    }

    const updatedPost = updateResult.rows[0];

    // Get user information for the response (to match addPost response format)
    const userQuery = "SELECT username, image, email FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [userInfo.id]);

    const postWithAuthor = {
      ...updatedPost,
      author_username: userResult.rows[0]?.username,
      author_img: userResult.rows[0]?.image,
      author_email: userResult.rows[0]?.email,
    };

    console.log(
      `Post updated successfully: ID ${postId}, Title: "${updatedPost.title}"`
    );

    return res.status(200).json({
      message: "Post updated successfully",
      post: postWithAuthor,
    });
  } catch (err) {
    console.error("Error in updatePost:", err);

    // Handle specific error types
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token format" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    } else if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "A post with this title already exists" });
    } else if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Invalid user or category reference" });
    } else if (err.code && err.code.startsWith("22")) {
      return res.status(400).json({ error: "Invalid data format" });
    } else if (err.code && err.code.startsWith("23")) {
      return res.status(409).json({ error: "Database constraint violation" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
// Example of how you can extend this for other functions
export const getPostsByUser = async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await executePostQuery("u.username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching posts by user:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

