import axios from "axios";

const contactEmail =
  process.env.OPEN_LIBRARY_CONTACT_EMAIL?.trim();

const userAgent = contactEmail
  ? `MediaLogger (${contactEmail})`
  : "MediaLogger/1.0";

const openLibraryClient = axios.create({
  baseURL:
    process.env.OPEN_LIBRARY_BASE_URL ||
    "https://openlibrary.org",

  timeout: 10_000,

  headers: {
    Accept: "application/json",
    "User-Agent": userAgent,
  },
});

export default openLibraryClient;