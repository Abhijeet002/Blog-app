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

    console.log("Found post:", result.rows[0]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching single post:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example of how you can extend this for other functions
// export const getPostsByUser = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const result = await executePostQuery('p.uid = $1', [userId]);
//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching posts by user:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getRecentPosts = async (req, res) => {
//   const limit = req.query.limit || 10;

//   try {
//     const query = getBasePostQuery('', 'p.date DESC') + ` LIMIT $1`;
//     const result = await db.query(query, [limit]);
//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching recent posts:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const searchPosts = async (req, res) => {
//   const searchTerm = req.query.q;

//   try {
//     if (!searchTerm) {
//       return res.status(400).json({ error: "Search term is required" });
//     }

//     const result = await executePostQuery(
//       'p.title ILIKE $1 OR p.description ILIKE $1',
//       [`%${searchTerm}%`]
//     );

//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error searching posts:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

export const deletePost = async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const jwt_secret_key = process.env.JWT_SECRET;

    if (!accessToken) {
      return res.status(401).json({ error: 'Not Authenticated' });
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

    // Fix: Check length property correctly
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Fix: Get the post from checkResult
    const post = checkResult.rows[0];

    // Check if user owns the post
    if (post.uid !== userInfo.id) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    // Delete the post
    const deleteQuery = "DELETE FROM posts WHERE id = $1 AND uid = $2";
    // Fix: Add await here
    const deleteResult = await db.query(deleteQuery, [postId, userInfo.id]);

    if (deleteResult.rowCount === 0) {
      return res.status(500).json({ error: "Failed to delete post" });
    }

    console.log(`Post deleted successfully: ID ${postId}, Title: "${post.title}"`);
    return res.status(200).json({
      message: "Post deleted successfully",
      deletedPost: {
        id: post.id,
        title: post.title
      }
    });

  } catch (err) { // Fix: Use 'err' consistently
    console.error("Error in deletePost:", err);

    // Handle specific error types
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: "Invalid token format" });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: "Token has expired" });
    } else if (err.code && err.code.startsWith('22')) { // PostgreSQL data type errors
      return res.status(400).json({ error: "Invalid data format" });
    } else if (err.code && err.code.startsWith('23')) { // PostgreSQL constraint errors
      return res.status(409).json({ error: "Database constraint violation" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
export const addPost = (req, res) => {};
export const updatePost = (req, res) => {};
