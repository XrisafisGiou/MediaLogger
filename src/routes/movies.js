import express from "express";
import { addMovie, getMovies, updateMovie, deleteMovie } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', authMiddleware, addMovie); 
router.get("/", authMiddleware, getMovies);
router.patch("/:id", authMiddleware, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;