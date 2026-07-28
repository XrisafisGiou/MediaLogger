import axios from "axios";

let accessToken = null;
let accessTokenExpiresAt = 0;

function requireEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

async function requestAccessToken() {
  const response = await axios.post(
    process.env.TWITCH_TOKEN_URL ||
      "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: requireEnvironmentVariable("TWITCH_CLIENT_ID"),
        client_secret: requireEnvironmentVariable(
          "TWITCH_CLIENT_SECRET",
        ),
        grant_type: "client_credentials",
      },
    },
  );

  accessToken = response.data.access_token;

  const expiresInSeconds = Math.max(
    Number(response.data.expires_in) - 60,
    0,
  );

  accessTokenExpiresAt =
    Date.now() + expiresInSeconds * 1000;

  return accessToken;
}

async function getAccessToken() {
  if (
    accessToken &&
    Date.now() < accessTokenExpiresAt
  ) {
    return accessToken;
  }

  return requestAccessToken();
}

const igdbClient = axios.create({
  baseURL:
    process.env.IGDB_BASE_URL ||
    "https://api.igdb.com/v4",
});

igdbClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  config.headers = config.headers || {};
  config.headers["Client-ID"] =
    requireEnvironmentVariable("TWITCH_CLIENT_ID");
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "text/plain";

  return config;
});

igdbClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._igdbRetried
    ) {
      originalRequest._igdbRetried = true;

      accessToken = null;
      accessTokenExpiresAt = 0;

      return igdbClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default igdbClient;