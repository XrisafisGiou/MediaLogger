import tmdb from "../services/tmdb.js";

export async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;

    const response = await tmdb.get(`/movie/${id}`);

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch movie details",
    });
  }
}


export async function searchMovies(req, res) {
  try {
    const { query } = req.query;

    const response = await tmdb.get("/search/movie", {
      params: {
        query,
      },
    });

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to search movies",
    });
  }
}


export async function getMovieImages(req, res) {
  try {
    const { id } = req.params;

    const response = await tmdb.get(`/movie/${id}/images`);

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch movie images",
    });
  }
}


export async function getMovieCredits(req, res) {
  try {
    const { id } = req.params;

    const response = await tmdb.get(`/movie/${id}/credits`);

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch movie credits",
    });
  }
}