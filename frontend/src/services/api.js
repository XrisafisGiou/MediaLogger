import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

tmdb.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "en-US",
    include_adult: false,
  };

  return config;
});

export const login = (username, password) =>
  api.post("/users/login", { username, password }).then((r) => r.data);

export const register = (username, password) =>
  api.post("/users/register", { username, password }).then((r) => r.data);

export const getMovies = () =>
  api.get("/movies").then((r) => r.data);

export const addMovie = (data) =>
  api.post("/movies", data).then((r) => r.data);

export const updateMovie = (id, data) =>
  api.patch(`/movies/${id}`, data).then((r) => r.data);

export const deleteMovie = (id) =>
  api.delete(`/movies/${id}`).then((r) => r.data);

export const searchMovies = (query) =>
  tmdb
    .get("/search/movie", {
      params: { query },
    })
    .then((r) => r.data);

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`).then((r) => r.data);

export const getMovieStatus = (tmdbId) =>
  api.get(`/movies/status/${tmdbId}`)
     .then((r) => r.data);

export const getCurrentUser = () =>
  api.get("/users/me").then((r) => r.data);

export const changePassword = (data) =>
  api.patch("/users/password", data)
     .then((r) => r.data);

export const getMovieImages = async (tmdbId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${tmdbId}/images`,
    {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
      },
    }
  );

  return res.data;
};

export const getMovieCredits = (tmdbId) =>
  axios
    .get(
      `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    )
    .then((r) => r.data);