import movieService from "../services/movieService.js";
import { createMediaController } from "./mediaController.js";

const controller = createMediaController(movieService);

export const {
  add: addMovie,
  getAll: getMovies,
  update: updateMovie,
  delete: deleteMovie,
  check: checkMovie,
  getStatus: getMovieStatus,
} = controller;

export default controller;
