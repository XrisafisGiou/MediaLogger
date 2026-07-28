import { MEDIA_TYPES } from "../config/mediaTypes.js";
import prisma from "../lib/prisma.js";
import { MediaService } from "./mediaService.js";

export class GameService extends MediaService {
  constructor(prismaClient = prisma) {
    super(MEDIA_TYPES.game, prismaClient);
  }

  addGame(...args) {
    return this.add(...args);
  }

  getGames(...args) {
    return this.getAll(...args);
  }

  updateGame(...args) {
    return this.update(...args);
  }

  deleteGame(...args) {
    return this.delete(...args);
  }

  getGameStatus(...args) {
    return this.getStatus(...args);
  }
}

export default new GameService();