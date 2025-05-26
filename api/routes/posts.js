// api\routes\posts.js

import express from "express";
import {addPost, deletePost, getAllPost, getPostByCategory, getSinglePost, updatePost} from "../controllers/posts.js";

const router = express.Router();

router.get("/",getAllPost);
router.get("/category/:category", getPostByCategory);
router.get("/:id", getSinglePost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;
