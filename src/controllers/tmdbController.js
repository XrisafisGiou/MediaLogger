import tmdbService from "../services/tmdbService.js";

export async function getMovieDetails(req, res) {
  const movie = await tmdbService.getMovieDetails(req.params.id);
  return res.json(movie);
}


export async function searchMovies(req, res) {
  const movies = await tmdbService.searchMovies(req.query.query);
  return res.json(movies);
}


export async function getMovieImages(req, res) {
  const images = await tmdbService.getMovieImages(req.params.id);
  return res.json(images);
}


export async function getMovieCredits(req, res) {
  const credits = await tmdbService.getMovieCredits(req.params.id);
  return res.json(credits);
}
