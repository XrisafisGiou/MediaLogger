import axios from "axios";

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
});

tmdbClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: process.env.TMDB_API_KEY,
    include_adult: false,
  };

  return config;
});

export default tmdbClient;
