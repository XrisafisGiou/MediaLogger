import express from "express";
import { getMovieDetails, searchMovies, getMovieImages, getMovieCredits } from "../controllers/tmdbController.js";

const router = express.Router();

router.get("/search/movie", searchMovies);
router.get("/movie/:id", getMovieDetails);
router.get("/movie/:id/images", getMovieImages);
router.get("/movie/:id/credits", getMovieCredits);

export default router;