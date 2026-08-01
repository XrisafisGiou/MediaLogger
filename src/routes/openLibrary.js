import express from "express";
import {
  getBookDetails,
  getBookImages,
  searchBooks,
} from "../controllers/googleBooksController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/search/book", searchBooks);
router.get("/book/:id", getBookDetails);
router.get("/book/:id/images", getBookImages);

export default router;