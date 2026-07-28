import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

export function createMediaRouter(controller) {
  const router = express.Router();

  router.use(authMiddleware);
  router.post("/", controller.add);
  router.get("/", controller.getAll);
  router.get("/status/:tmdbId", controller.getStatus);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
