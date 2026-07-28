import tmdbService from "../services/tmdbService.js";

export function createTmdbMediaController(mediaType) {
  return {
    async getDetails(req, res) {
      const media = await tmdbService.getDetails(
        mediaType,
        req.params.id,
      );
      return res.json(media);
    },

    async search(req, res) {
      const media = await tmdbService.search(
        mediaType,
        req.query.query,
      );
      return res.json(media);
    },

    async getImages(req, res) {
      const images = await tmdbService.getImages(
        mediaType,
        req.params.id,
      );
      return res.json(images);
    },

    async getCredits(req, res) {
      const credits = await tmdbService.getCredits(
        mediaType,
        req.params.id,
      );
      return res.json(credits);
    },
  };
}

const movieController = createTmdbMediaController("movie");
const tvShowController = createTmdbMediaController("tvShow");

export const {
  getDetails: getMovieDetails,
  search: searchMovies,
  getImages: getMovieImages,
  getCredits: getMovieCredits,
} = movieController;

export const {
  getDetails: getTvShowDetails,
  search: searchTvShows,
  getImages: getTvShowImages,
  getCredits: getTvShowCredits,
} = tvShowController;
