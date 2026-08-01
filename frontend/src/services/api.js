import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

const responseData = (response) => response.data;

function createMediaApi(
  collectionPath,
  providerPath,
  providerResource,
) {
  return {
    getAll: () =>
      api
        .get(`/${collectionPath}`)
        .then(responseData),

    add: (data) =>
      api
        .post(`/${collectionPath}`, data)
        .then(responseData),

    update: (id, data) =>
      api
        .patch(`/${collectionPath}/${id}`, data)
        .then(responseData),

    remove: (id) =>
      api
        .delete(`/${collectionPath}/${id}`)
        .then(responseData),

    getStatus: (externalId) =>
      api
        .get(
          `/${collectionPath}/status/${externalId}`,
        )
        .then(responseData),

    search: (query) =>
      api
        .get(
          `/${providerPath}/search/${providerResource}`,
          {
            params: { query },
          },
        )
        .then(responseData),

    getDetails: (externalId) =>
      api
        .get(
          `/${providerPath}/${providerResource}/${externalId}`,
        )
        .then(responseData),

    getImages: (externalId) =>
      api
        .get(
          `/${providerPath}/${providerResource}/${externalId}/images`,
        )
        .then(responseData),

    getCredits: (externalId) =>
      api
        .get(
          `/${providerPath}/${providerResource}/${externalId}/credits`,
        )
        .then(responseData),
  };
}

const movieApi = createMediaApi("movies", "tmdb", "movie");
const tvShowApi = createMediaApi("tv-shows", "tmdb", "tv");
const gameApi = createMediaApi("games", "igdb", "game");
const bookApi = createMediaApi("books", "google-books", "book",);

export const login = (username, password) =>
  api.post("/users/login", { username, password }).then(responseData);

export const register = (username, password) =>
  api.post("/users/register", { username, password }).then(responseData);

export const getCurrentUser = () =>
  api.get("/users/me").then(responseData);

export const changePassword = (data) =>
  api.patch("/users/password", data).then(responseData);

export const getMovies = movieApi.getAll;
export const addMovie = movieApi.add;
export const updateMovie = movieApi.update;
export const deleteMovie = movieApi.remove;
export const getMovieStatus = movieApi.getStatus;
export const searchMovies = movieApi.search;
export const getMovieDetails = movieApi.getDetails;
export const getMovieImages = movieApi.getImages;
export const getMovieCredits = movieApi.getCredits;

export const getTvShows = tvShowApi.getAll;
export const addTvShow = tvShowApi.add;
export const updateTvShow = tvShowApi.update;
export const deleteTvShow = tvShowApi.remove;
export const getTvShowStatus = tvShowApi.getStatus;
export const searchTvShows = tvShowApi.search;
export const getTvShowDetails = tvShowApi.getDetails;
export const getTvShowImages = tvShowApi.getImages;
export const getTvShowCredits = tvShowApi.getCredits;

export const getGames = gameApi.getAll;
export const addGame = gameApi.add;
export const updateGame = gameApi.update;
export const deleteGame = gameApi.remove;
export const getGameStatus = gameApi.getStatus;
export const searchGames = gameApi.search;
export const getGameDetails = gameApi.getDetails;
export const getGameImages = gameApi.getImages;

export const getBooks = bookApi.getAll;
export const addBook = bookApi.add;
export const updateBook = bookApi.update;
export const deleteBook = bookApi.remove;
export const getBookStatus = bookApi.getStatus;
export const searchBooks = bookApi.search;
export const getBookDetails = bookApi.getDetails;
export const getBookImages = bookApi.getImages;