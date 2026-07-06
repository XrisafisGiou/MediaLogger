import express from "express";
import { addMovie, getMovies, updateMovie, deleteMovie, checkMovie } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post('/', addMovie); 
router.get("/", getMovies);
router.get("/check/:tmdbId", checkMovie);
router.patch("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;