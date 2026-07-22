import movieService from "../services/movieService.js";

export async function addMovie(req, res) {
  const movie = await movieService.addMovie(req.user.userId, req.body);
  return res.json(movie);
}

export async function getMovies(req, res) {
  const movies = await movieService.getMovies(req.user.userId);
  return res.json(movies);
}

export const updateMovie = async (req, res) => {
  const movie = await movieService.updateMovie(
    req.user.userId,
    req.params.id,
    req.body,
  );
  return res.json(movie);
};

export const deleteMovie = async (req, res) => {
  const result = await movieService.deleteMovie(
    req.user.userId,
    req.params.id,
  );
  return res.json(result);
};

export async function checkMovie(req, res) {
  const movie = await movieService.checkMovie(
    req.user.userId,
    req.params.tmdbId,
  );
  return res.json(movie);
}

export async function getMovieStatus(req, res) {
  const status = await movieService.getMovieStatus(
    req.user.userId,
    req.params.tmdbId,
  );
  return res.json(status);
}
