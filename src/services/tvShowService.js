import { MEDIA_TYPES } from "../config/mediaTypes.js";
import prisma from "../lib/prisma.js";
import { MediaService } from "./mediaService.js";

export class TvShowService extends MediaService {
  constructor(prismaClient = prisma) {
    super(MEDIA_TYPES.tvShow, prismaClient);
  }

  addTvShow(...args) {
    return this.add(...args);
  }

  getTvShows(...args) {
    return this.getAll(...args);
  }

  updateTvShow(...args) {
    return this.update(...args);
  }

  deleteTvShow(...args) {
    return this.delete(...args);
  }

  getTvShowStatus(...args) {
    return this.getStatus(...args);
  }
}

export default new TvShowService();
