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

function createMediaApi(collectionPath, tmdbResource) {
  return {
    getAll: () => api.get(`/${collectionPath}`).then(responseData),
    add: (data) => api.post(`/${collectionPath}`, data).then(responseData),
    update: (id, data) =>
      api.patch(`/${collectionPath}/${id}`, data).then(responseData),
    remove: (id) =>
      api.delete(`/${collectionPath}/${id}`).then(responseData),
    getStatus: (tmdbId) =>
      api
        .get(`/${collectionPath}/status/${tmdbId}`)
        .then(responseData),
    search: (query) =>
      api
        .get(`/tmdb/search/${tmdbResource}`, {
          params: { query },
        })
        .then(responseData),
    getDetails: (tmdbId) =>
      api.get(`/tmdb/${tmdbResource}/${tmdbId}`).then(responseData),
    getImages: (tmdbId) =>
      api
        .get(`/tmdb/${tmdbResource}/${tmdbId}/images`)
        .then(responseData),
    getCredits: (tmdbId) =>
      api
        .get(`/tmdb/${tmdbResource}/${tmdbId}/credits`)
        .then(responseData),
  };
}

const movieApi = createMediaApi("movies", "movie");
const tvShowApi = createMediaApi("tv-shows", "tv");

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
