import tmdbClient from "../clients/tmdbClient.js";
import { ExternalServiceError } from "../errors/serviceErrors.js";

export class TmdbService {
  constructor(client = tmdbClient) {
    this.client = client;
  }

  async getMovieDetails(id) {
    return this.get(`/movie/${id}`, undefined, "Failed to fetch movie details");
  }

  async searchMovies(query) {
    return this.get(
      "/search/movie",
      { query },
      "Failed to search movies",
    );
  }

  async getMovieImages(id) {
    return this.get(
      `/movie/${id}/images`,
      undefined,
      "Failed to fetch movie images",
    );
  }

  async getMovieCredits(id) {
    return this.get(
      `/movie/${id}/credits`,
      undefined,
      "Failed to fetch movie credits",
    );
  }

  async get(path, params, errorMessage) {
    try {
      const config = params ? { params } : undefined;
      const response = await this.client.get(path, config);
      return response.data;
    } catch (error) {
      throw new ExternalServiceError(errorMessage, { cause: error });
    }
  }
}

export default new TmdbService();
