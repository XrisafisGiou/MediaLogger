import axios from "axios";

function getApiKey() {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_BOOKS_API_KEY is not configured",
    );
  }

  return apiKey;
}

const googleBooksClient = axios.create({
  baseURL:
    process.env.GOOGLE_BOOKS_BASE_URL ||
    "https://www.googleapis.com/books/v1",
});

googleBooksClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    key: getApiKey(),
  };

  return config;
});

export default googleBooksClient;