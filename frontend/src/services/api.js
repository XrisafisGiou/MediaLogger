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
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

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
  api.get(`/movies/search?q=${query}`).then((r) => r.data);