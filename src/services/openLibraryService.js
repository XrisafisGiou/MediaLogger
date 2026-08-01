import openLibraryClient from "../clients/openLibraryClient.js";
import {
  ExternalServiceError,
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";

const SEARCH_FIELDS = [
  "key",
  "title",
  "subtitle",
  "author_name",
  "first_publish_year",
  "cover_i",
  "subject",
  "number_of_pages_median",
  "publisher",
  "language",
  "first_sentence",
  "edition_count",
].join(",");

function normalizeWorkId(key) {
  return String(key ?? "")
    .replace(/^\/works\//, "")
    .trim();
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? values.filter(Boolean)
    : [];
}

const GENRE_RULES = [
  {
    name: "Science Fiction",
    patterns: [
      /\bscience fiction\b/i,
      /\bsci[- ]?fi\b/i,
    ],
  },
  {
    name: "Historical Fiction",
    patterns: [/\bhistorical fiction\b/i],
  },
  {
    name: "Young Adult",
    patterns: [
      /\byoung adult\b/i,
      /\bjuvenile fiction\b/i,
    ],
  },
  {
    name: "Children's",
    patterns: [
      /\bchildren'?s\b/i,
      /\bjuvenile literature\b/i,
    ],
  },
  {
    name: "Graphic Novel",
    patterns: [/\bgraphic novels?\b/i],
  },
  {
    name: "Comics",
    patterns: [
      /\bcomics?\b/i,
      /\bcomic books?\b/i,
    ],
  },
  {
    name: "Fantasy",
    patterns: [/\bfantasy\b/i],
  },
  {
    name: "Mystery",
    patterns: [
      /\bmystery\b/i,
      /\bmysteries\b/i,
    ],
  },
  {
    name: "Thriller",
    patterns: [
      /\bthrillers?\b/i,
      /\bsuspense\b/i,
    ],
  },
  {
    name: "Crime",
    patterns: [
      /\bcrime\b/i,
      /\bdetective fiction\b/i,
    ],
  },
  {
    name: "Horror",
    patterns: [/\bhorror\b/i],
  },
  {
    name: "Romance",
    patterns: [
      /\bromance\b/i,
      /\blove stories\b/i,
    ],
  },
  {
    name: "Adventure",
    patterns: [/\badventure\b/i],
  },
  {
    name: "Biography",
    patterns: [
      /\bbiography\b/i,
      /\bbiographies\b/i,
      /\bbiographical\b/i,
    ],
  },
  {
    name: "Autobiography",
    patterns: [/\bautobiograph/i],
  },
  {
    name: "Memoir",
    patterns: [/\bmemoirs?\b/i],
  },
  {
    name: "History",
    patterns: [/\bhistory\b/i],
  },
  {
    name: "Poetry",
    patterns: [
      /\bpoetry\b/i,
      /\bpoems?\b/i,
    ],
  },
  {
    name: "Drama",
    patterns: [
      /\bdrama\b/i,
      /\bplays?\b/i,
    ],
  },
  {
    name: "Comedy",
    patterns: [
      /\bcomedy\b/i,
      /\bhumou?r\b/i,
    ],
  },
  {
    name: "Nonfiction",
    patterns: [/\bnon[- ]?fiction\b/i],
  },
];

function normalizeGenres(subjects) {
  const genres = [];

  for (const subject of normalizeStringArray(
    subjects,
  )) {
    const matchingRule = GENRE_RULES.find(
      (rule) =>
        rule.patterns.some((pattern) =>
          pattern.test(subject),
        ),
    );

    if (
      matchingRule &&
      !genres.includes(matchingRule.name)
    ) {
      genres.push(matchingRule.name);
    }
  }

  return genres.slice(0, 6);
}

function getText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  if (
    value &&
    typeof value.value === "string"
  ) {
    return value.value.trim();
  }

  return "";
}

function getFirstString(value) {
  if (Array.isArray(value)) {
    return value.find(Boolean) || "";
  }

  return typeof value === "string"
    ? value
    : "";
}

function getCoverUrl(
  coverId,
  size = "L",
) {
  if (!coverId) {
    return null;
  }

  return (
    `https://covers.openlibrary.org/` +
    `b/id/${coverId}-${size}.jpg?default=false`
  );
}

function getPublishedDate(firstPublishYear) {
  if (!firstPublishYear) {
    return null;
  }

  return String(firstPublishYear);
}

function normalizeSearchResult(document) {
  const publishedDate =
    getPublishedDate(
      document.first_publish_year,
    );

  return {
    id: normalizeWorkId(document.key),

    title:
      document.title || "Untitled",

    authors: normalizeStringArray(
      document.author_name,
    ),

    publishedDate,
    releaseYear: publishedDate,

    poster_path: getCoverUrl(
      document.cover_i,
      "L",
    ),
  };
}

function normalizeBookDetails(document) {
  const publishedDate =
    getPublishedDate(
      document.first_publish_year,
    );

  const cover = getCoverUrl(
    document.cover_i,
    "L",
  );

  const publishers =
    normalizeStringArray(
      document.publisher,
    );

  const languages =
    normalizeStringArray(
      document.language,
    );

  const pageCount =
    Number(
      document.number_of_pages_median,
    );

  return {
    id: normalizeWorkId(document.key),

    title:
      document.title || "Untitled",

    subtitle: getFirstString(
      document.subtitle,
    ),

    authors: normalizeStringArray(
      document.author_name,
    ),

    publishedDate,
    releaseYear: publishedDate,

    publisher:
      publishers[0] || "",

    overview: getText(
      document.first_sentence,
    ),

    categories: normalizeGenres(
      document.subject,
    ),

    pageCount:
      Number.isInteger(pageCount) &&
      pageCount > 0
        ? pageCount
        : null,

    language:
      languages[0] || null,

    poster_path: cover,
    backdrop_path: cover,
  };
}

function isUsefulResult(document) {
  return Boolean(
    normalizeWorkId(document.key) &&
      document.title &&
      document.author_name?.length &&
      document.cover_i,
  );
}

export class OpenLibraryService {
  constructor(
    client = openLibraryClient,
  ) {
    this.client = client;
  }

  async searchBooks(query) {
    const trimmedQuery = String(
      query ?? "",
    ).trim();

    if (!trimmedQuery) {
      return {
        results: [],
      };
    }

    try {
      const response =
        await this.client.get(
          "/search.json",
          {
            params: {
              q: trimmedQuery,
              fields: SEARCH_FIELDS,

              limit: 40,
            },
          },
        );

      const documents =
        response.data.docs || [];

      const results = documents
        .filter(isUsefulResult)
        .slice(0, 20)
        .map(normalizeSearchResult);

      return {
        results,
      };
    } catch (error) {
      console.error(
        "Open Library search error:",
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
    const workId = normalizeWorkId(id);

    if (!workId) {
      throw new ValidationError(
        "Invalid Open Library work ID",
      );
    }

    try {
      const response =
        await this.client.get(
          "/search.json",
          {
            params: {
              q: `key:/works/${workId}`,
              fields: SEARCH_FIELDS,
              limit: 1,
            },
          },
        );

      const documents =
        response.data.docs || [];

      const document =
        documents.find(
          (item) =>
            normalizeWorkId(
              item.key,
            ) === workId,
        ) || documents[0];

      if (!document) {
        throw new NotFoundError(
          "Book not found",
        );
      }

      return normalizeBookDetails(
        document,
      );
    } catch (error) {
      if (
        error instanceof NotFoundError
      ) {
        throw error;
      }

      if (
        error.response?.status === 404
      ) {
        throw new NotFoundError(
          "Book not found",
          {
            cause: error,
          },
        );
      }

      console.error(
        "Open Library details error:",
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

export default new OpenLibraryService();