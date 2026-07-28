import tvShowService from "../services/tvShowService.js";
import { createMediaController } from "./mediaController.js";

const controller = createMediaController(tvShowService);

export const {
  add: addTvShow,
  getAll: getTvShows,
  update: updateTvShow,
  delete: deleteTvShow,
  getStatus: getTvShowStatus,
} = controller;

export default controller;
