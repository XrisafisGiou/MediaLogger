import bookController from "../controllers/bookController.js";
import { createMediaRouter } from "./media.js";

export default createMediaRouter(bookController);