import googleBooksClient from "../clients/googleBooksClient.js";
import {
  ExternalServiceError,
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";

function normalizeImageUrl(url) {
  if (!url) {
    return null;
  }

  return url.replace(/^http:\/\//i, "https://");
}

function getBestCover(imageLinks = {}) {
  return normalizeImageUrl(
    imageLinks.extraLarge ||
      imageLinks.large ||
      imageLinks.medium ||
      imageLinks.small ||
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail,
  );
}

function cleanDescription(description) {
  if (!description) {
    return "";
  }

  return String(description)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getReleaseYear(publishedDate) {
  if (!publishedDate) {
    return null;
  }

  const match = String(publishedDate).match(/\d{4}/);

  return match?.[0] ?? null;
}

function normalizeAuthors(authors) {
  return Array.isArray(authors)
    ? authors.filter(Boolean)
    : [];
}

function normalizeCategories(categories) {
  return Array.isArray(categories)
    ? categories.filter(Boolean)
    : [];
}

function normalizeSearchResult(volume) {
  const volumeInfo = volume.volumeInfo || {};

  return {
    id: volume.id,
    title: volumeInfo.title || "Untitled",
    authors: normalizeAuthors(volumeInfo.authors),
    publishedDate: volumeInfo.publishedDate || null,
    releaseYear: getReleaseYear(
      volumeInfo.publishedDate,
    ),
    poster_path: getBestCover(volumeInfo.imageLinks),
  };
}

function normalizeBookDetails(volume) {
  const volumeInfo = volume.volumeInfo || {};
  const cover = getBestCover(volumeInfo.imageLinks);

  return {
    id: volume.id,

    title: volumeInfo.title || "Untitled",
    subtitle: volumeInfo.subtitle || "",

    authors: normalizeAuthors(volumeInfo.authors),

    publishedDate: volumeInfo.publishedDate || null,
    releaseYear: getReleaseYear(
      volumeInfo.publishedDate,
    ),

    publisher: volumeInfo.publisher || "",
    overview: cleanDescription(
      volumeInfo.description,
    ),

    categories: normalizeCategories(
      volumeInfo.categories,
    ),

    pageCount: Number.isInteger(volumeInfo.pageCount)
      ? volumeInfo.pageCount
      : null,

    language: volumeInfo.language || null,

    poster_path: cover,

    backdrop_path: cover,
  };
}

export class GoogleBooksService {
  constructor(client = googleBooksClient) {
    this.client = client;
  }

  async searchBooks(query) {
    const trimmedQuery = query?.trim();

    if (!trimmedQuery) {
      return {
        results: [],
      };
    }

    try {
      const response = await this.client.get(
        "/volumes",
        {
          params: {
            q: trimmedQuery,
            printType: "books",
            orderBy: "relevance",
            maxResults: 20,
          },
        },
      );

      const volumes = response.data.items || [];

      return {
        results: volumes
          .filter(
            (volume) =>
              volume.id &&
              volume.volumeInfo?.title,
          )
          .map(normalizeSearchResult),
      };
    } catch (error) {
      console.error(
        "Google Books search error:",
        error.response?.status,
        error.response?.data,
      );

      throw new ExternalServiceError(
        "Failed to search books",
        {
          cause: error,
        },
      );
    }
  }

  async getBookDetails(id) {
    const volumeId = String(id || "").trim();

    if (!volumeId) {
      throw new ValidationError(
        "Invalid Google Books ID",
      );
    }

    try {
      const response = await this.client.get(
        `/volumes/${encodeURIComponent(volumeId)}`,
      );

      return normalizeBookDetails(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundError(
          "Book not found",
          {
            cause: error,
          },
        );
      }

      console.error(
        "Google Books details error:",
        error.response?.status,
        error.response?.data,
      );

      throw new ExternalServiceError(
        "Failed to fetch book details",
        {
          cause: error,
        },
      );
    }
  }

  async getBookImages() {
    return {
      backdrops: [],
    };
  }
}

export default new GoogleBooksService();