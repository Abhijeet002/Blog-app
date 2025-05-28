// // api\controllers\posts.js
// import { db } from "../db.js";

// export const getPostByCategory = async (req, res) => {
//   const category = req.params.category?.trim().toLowerCase();

//   try {
//     let q, values;
//     console.log(`Fetching posts for category: ${category}`);

//     if (category) {
//       q = "SELECT * FROM posts WHERE category = $1";
//       values = [category];
//     } else {
//       q = "SELECT * FROM posts";
//       values = [];
//     }

//     const result = await db.query(q, values); //  fixed variable name
//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No posts found for this category" });
//     }

//     // If posts exist, return them
//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching posts by category:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getAllPost = async (req, res) => {
//   try {
//     const q = "SELECT * FROM posts";
//     const result = await db.query(q);

//     if (result.rows.length === 0) {
//       return res.status(200).json([]);
//     }

//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error fetching posts:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getSinglePost = async (req, res) => {
//   const postId = req.params.id;

//   try {
//     console.log(`Fetching post with ID: ${postId}`);

//     const q = `
//       SELECT 
//         p.id,
//         p.title,
//         p.description,
//         p.img,
//         p.category,
//         p.date,
//         u.username,
//         u.image AS author_img
//       FROM posts p
//       JOIN users u ON p.uid = u.id
//       WHERE p.id = $1
//     `;

//     const result = await db.query(q, [postId]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     console.log("Found post:", result.rows[0]);
//     return res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error("Error fetching single post:", err.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const addPost = (req, res) => {};
// export const deletePost = (req, res) => {};
// export const updatePost = (req, res) => {};



// api\controllers\posts.js
import { db } from "../db.js";

// Base query builder for posts with user information
const getBasePostQuery = (whereClause = '', orderBy = 'p.date DESC') => {
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
    ${whereClause ? `WHERE ${whereClause}` : ''}
    ORDER BY ${orderBy}
  `;
};

// Helper function to execute post queries
const executePostQuery = async (whereClause = '', values = [], orderBy = 'p.date DESC') => {
  const query = getBasePostQuery(whereClause, orderBy);
  return await db.query(query, values);
};

export const getPostByCategory = async (req, res) => {
  const category = req.params.category?.trim().toLowerCase();

  try {
    console.log(`Fetching posts for category: ${category}`);

    let result;
    if (category) {
      result = await executePostQuery('p.category = $1', [category]);
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

    const result = await executePostQuery('p.id = $1', [postId]);

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

export const deletePost = (req, res) => {
  
};
export const addPost = (req, res) => {};
export const updatePost = (req, res) => {};