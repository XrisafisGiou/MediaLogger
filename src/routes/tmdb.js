import express from "express";
import { getMovieDetails, searchMovies, getMovieImages, getMovieCredits, getTvShowCredits, getTvShowImages, getTvShowDetails, searchTvShows } from "../controllers/tmdbController.js";

const router = express.Router();

router.get("/search/movie", searchMovies);
router.get("/movie/:id", getMovieDetails);
router.get("/movie/:id/images", getMovieImages);
router.get("/movie/:id/credits", getMovieCredits);

router.get("/search/tv", searchTvShows);
router.get("/tv/:id", getTvShowDetails);
router.get("/tv/:id/images", getTvShowImages);
router.get("/tv/:id/credits", getTvShowCredits);

export default router;