import express from "express";
import { addMovie } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', authMiddleware, addMovie); 

export default router;