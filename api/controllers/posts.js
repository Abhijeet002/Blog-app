// api\controllers\posts.js
import { db } from "../db.js";

export const getPostByCategory = async (req, res) => {
  const category = req.params.category?.trim().toLowerCase();

  try {
    let q, values;
    console.log(`Fetching posts for category: ${category}`);

    if (category) {
      q = "SELECT * FROM posts WHERE category = $1";
      values = [category];
    } else {
      q = "SELECT * FROM posts";
      values = [];
    }

    const result = await db.query(q, values); //  fixed variable name
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this category" });
    }

    // If posts exist, return them
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching posts by category:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const q = "SELECT * FROM posts";
    const result = await db.query(q);

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
    
    const q = "SELECT * FROM posts WHERE id = $1";
    const result = await db.query(q, [postId]);
    
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

export const addPost = (req, res) => {};
export const deletePost = (req, res) => {};
export const updatePost = (req, res) => {};
