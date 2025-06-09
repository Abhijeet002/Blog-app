import express from "express";
import { addUser, getUser, getUserByUsername, updateUser } from "../controllers/user.js";


const router = express.Router();

router.post("/register", addUser);
router.put('/:id', updateUser);
router.get('/:id', getUser);
router.get('/username/:username', getUserByUsername);


export default router;