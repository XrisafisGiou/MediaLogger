import gameService from "../services/gameService.js";
import { createMediaController } from "./mediaController.js";

const controller = createMediaController(gameService);

export const {
  add: addGame,
  getAll: getGames,
  update: updateGame,
  delete: deleteGame,
  getStatus: getGameStatus,
} = controller;

export default controller;