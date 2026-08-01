import bookService from "../services/bookService.js";
import { createMediaController } from "./mediaController.js";

const controller = createMediaController(bookService);

export const {
  add: addBook,
  getAll: getBooks,
  update: updateBook,
  delete: deleteBook,
  getStatus: getBookStatus,
} = controller;

export default controller;