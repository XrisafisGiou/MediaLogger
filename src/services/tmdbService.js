import tmdbClient from "../clients/tmdbClient.js";
import { getMediaType } from "../config/mediaTypes.js";
import { ExternalServiceError } from "../errors/serviceErrors.js";

export class TmdbService {
  constructor(client = tmdbClient) {
    this.client = client;
  }

  async getMovieDetails(id) {
    return this.getDetails("movie", id);
  }

  async searchMovies(query) {
    return this.search("movie", query);
  }

  async getMovieImages(id) {
    return this.getImages("movie", id);
  }

  async getMovieCredits(id) {
    return this.getCredits("movie", id);
  }

  async getTvShowDetails(id) {
    return this.getDetails("tvShow", id);
  }

  async searchTvShows(query) {
    return this.search("tvShow", query);
  }

  async getTvShowImages(id) {
    return this.getImages("tvShow", id);
  }

  async getTvShowCredits(id) {
    return this.getCredits("tvShow", id);
  }

  getDetails(mediaType, id) {
    const { resource, errorLabel } = getMediaType(mediaType).tmdb;

    return this.get(
      `/${resource}/${id}`,
      undefined,
      `Failed to fetch ${errorLabel} details`,
    );
  }

  search(mediaType, query) {
    const { resource, errorPluralLabel } = getMediaType(mediaType).tmdb;

    return this.get(
      `/search/${resource}`,
      { query },
      `Failed to search ${errorPluralLabel}`,
    );
  }

  getImages(mediaType, id) {
    const { resource, errorLabel } = getMediaType(mediaType).tmdb;

    return this.get(
      `/${resource}/${id}/images`,
      undefined,
      `Failed to fetch ${errorLabel} images`,
    );
  }

  getCredits(mediaType, id) {
    const {
      resource,
      creditsResource,
      errorLabel,
    } = getMediaType(mediaType).tmdb;

    return this.get(
      `/${resource}/${id}/${creditsResource}`,
      undefined,
      `Failed to fetch ${errorLabel} credits`,
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
