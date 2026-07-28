import express from "express";
import {
  getGameDetails,
  getGameImages,
  searchGames,
} from "../controllers/igdbController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/search/game", searchGames);
router.get("/game/:id", getGameDetails);
router.get("/game/:id/images", getGameImages);

export default router;