import geminiClient from "../clients/geminiClient.js";
import tmdbService from "./tmdbService.js";
import igdbService from "./igdbService.js";
import openLibraryService from "./openLibraryService.js";
import movieService from "./movieService.js";
import tvShowService from "./tvShowService.js";
import gameService from "./gameService.js";
import bookService from "./bookService.js";

async function getUserLibraryContext(userId) {
  const [
    movies,
    tvShows,
    games,
    books,
  ] = await Promise.all([
    movieService.getMovies(userId),
    tvShowService.getTvShows(userId),
    gameService.getGames(userId),
    bookService.getBooks(userId),
  ]);

  return {
    summary: {
      movies: movies.map((entry) => ({
        title: entry.movie.title,
        status: entry.status,
        favorite: entry.isFavorite,
      })),

      tvShows: tvShows.map((entry) => ({
        title: entry.tvShow.name,
        status: entry.status,
        favorite: entry.isFavorite,
      })),

      games: games.map((entry) => ({
        title: entry.game.name,
        status: entry.status,
        favorite: entry.isFavorite,
      })),

      books: books.map((entry) => ({
        title: entry.book.title,
        status: entry.status,
        favorite: entry.isFavorite,
      })),
    },

    completed: {
      movie: new Set(
        movies
          .filter(
            (entry) =>
              entry.status === "watched",
          )
          .map(
            (entry) =>
              entry.movie.tmdbMovieId,
          ),
      ),

      tv: new Set(
        tvShows
          .filter(
            (entry) =>
              entry.status === "watched",
          )
          .map(
            (entry) =>
              entry.tvShow.tmdbTvShowId,
          ),
      ),

      game: new Set(
        games
          .filter(
            (entry) =>
              entry.status === "watched",
          )
          .map(
            (entry) =>
              entry.game.igdbGameId,
          ),
      ),

      book: new Set(
        books
          .filter(
            (entry) =>
              entry.status === "watched",
          )
          .map(
            (entry) =>
              entry.book.openLibraryId,
          ),
      ),
    },
  };
}

function getYear(date) {
  if (!date) {
    return null;
  }

  return Number(date.slice(0, 4));
}

async function resolveTmdbMedia(item) {
  const results =
    item.type === "movie"
      ? await tmdbService.searchMovies(
          item.title,
        )
      : await tmdbService.searchTvShows(
          item.title,
        );

  const matches = results.results || [];

  const match =
    matches.find((result) => {
      const date =
        item.type === "movie"
          ? result.release_date
          : result.first_air_date;

      return getYear(date) === item.year;
    }) || matches[0];

  if (!match) {
    return null;
  }

  return {
    type: item.type,
    id: match.id,
    title:
      item.type === "movie"
        ? match.title
        : match.name,
    year: getYear(
      item.type === "movie"
        ? match.release_date
        : match.first_air_date,
    ),
    poster_path:
      match.poster_path || null,
  };
}

async function resolveGame(item) {
  const results =
    await igdbService.searchGames(
      item.title,
    );

  const matches = results.results || [];

  const match =
    matches.find(
      (game) =>
        game.releaseYear === item.year,
    ) || matches[0];

  if (!match) {
    return null;
  }

  return {
    type: "game",
    id: match.id,
    title: match.name,
    year: match.releaseYear,
    poster_path:
      match.poster_path || null,
  };
}

async function resolveBook(item) {
  const results =
    await openLibraryService.searchBooks(
      item.title,
    );

  const matches = results.results || [];

  const expectedAuthor =
    item.author?.toLowerCase();

  const match =
    matches.find((book) => {
      const yearMatches =
        Number(book.releaseYear) ===
        item.year;

      const authorMatches =
        !expectedAuthor ||
        book.authors?.some(
          (author) =>
            author.toLowerCase() ===
            expectedAuthor,
        );

      return (
        yearMatches &&
        authorMatches
      );
    }) ||
    matches.find((book) =>
      book.authors?.some(
        (author) =>
          author.toLowerCase() ===
          expectedAuthor,
      ),
    ) ||
    matches[0];

  if (!match) {
    return null;
  }

  return {
    type: "book",
    id: match.id,
    title: match.title,
    year:
      Number(match.releaseYear) ||
      item.year,
    author:
      match.authors?.[0] ||
      item.author,
    poster_path:
      match.poster_path || null,
  };
}

async function resolveMediaItem(item) {
  if (item.type === "game") {
    return resolveGame(item);
  }

  if (item.type === "book") {
    return resolveBook(item);
  }

  return resolveTmdbMedia(item);
}

export class AiService {
  constructor(client = geminiClient) {
    this.client = client;
  }

  async chat(userId, messages) {
  if (
    !Array.isArray(messages) ||
    !messages.length
  ) {
    throw new Error("Messages are required");
  }
  const {summary: library,
    completed,} = await getUserLibraryContext(
     userId,
    );
  const input = messages.map((message) => {
    if (message.role === "assistant") {
      return {
        type: "model_output",
        content: [
          {
            type: "text",
            text: message.text,
          },
        ],
      };
    }

    return {
      type: "user_input",
      content: [
        {
          type: "text",
          text: message.text,
        },
      ],
    };
  });

  const interaction =
  await this.client.interactions.create({
    model: "gemini-3.5-flash-lite",
    store: false,

    system_instruction: `
    You are Walter, MediaLogger's resident media know-it-all: part recommendation engine, part obsessive nerd, part mildly insufferable connoisseur.

    PERSONALITY:
    - You are Walter, a geeky, obsessive media connoisseur who knows movies, TV, games, and books extremely well.
    - You sound confident, sharp, and a little smug when appropriate.
    - You can be playfully sassy, teasing, or mildly sarcastic, but never rude or insulting.
    - You have strong opinions and are willing to say when something is overrated, underrated, derivative, messy, brilliant, or a cult classic.
    - You should sound like someone who has spent way too much time thinking about media and is delighted to prove it.
    - Avoid sounding corporate, robotic, overly polite, or generic.
    - Keep the sass secondary to usefulness. The recommendation still has to be clear and relevant.
    - Do not overdo jokes. One witty remark is enough.

    CRITICAL PERSONALIZATION RULES:
    - The user's MediaLogger library is authoritative.
    - Before recommending any media, check the library below.
    - If the user asks for recommendations similar to, based on, or like a specific media item, NEVER recommend that same media item back to them.
    - Treat the referenced media item only as a source of preferences/themes, not as a candidate recommendation.
    - Example: if the user says "Recommend movies like Interstellar", Interstellar must not appear in the recommendations.
    - NEVER recommend an item whose status is "watched".
    - For games, "watched" means the user has played it.
    - For books, "watched" means the user has read it.
    - Items with status "watchlist" may be recommended.
    - Prefer recommendations similar to items marked favorite.
    - When the user asks for recommendations "based on my taste",
        use their favorites and completed media as evidence of their preferences.
    - Do not ignore the library in favor of generic popular recommendations.
    - If an item is already completed, choose a different recommendation.

    REFERENCE ITEM RULE:
    - Any media item explicitly named by the user as the basis for recommendations must be excluded from the recommendation list.
    - Never return the reference item itself, even if it would otherwise be a perfect match.

    RESPONSE RULES:
    - Keep most responses under 80 words.
    - Recommend at most 3 items unless the user asks for more.
    - Put every recommendation on its own line.
    - Start each recommendation with "• ".
    - Leave a blank line between recommendations.
    - Give each recommendation one short explanation.
    - Do not use Markdown such as **bold** or *italics*.

    MEDIA OUTPUT RULES:
    - Include every recommended item in the media array.
    - Use "movie", "tv", "game", or "book".
    - Include title and release year.
    - For books include the primary author.
    - For movies, TV shows, and games, author must be null.

    USER LIBRARY:
    ${JSON.stringify(library)}
    `,

    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: {
        type: "object",
        properties: {
          response: {
            type: "string",
            description:
              "Walter's short conversational response.",
          },
          media: {
            type: "array",
            description:
              "Movies or TV shows relevant enough to display as MediaLogger cards.",
            items: {
            type: "object",
            properties: {
                type: {
                type: "string",
                enum: [
                    "movie",
                    "tv",
                    "game",
                    "book",
                    ],
                },
                title: {
                    type: "string",
                },
                year: {
                    type: "integer",
                },
                author: {
                    type: ["string", "null"],
                },
            },
            required: [
                "type",
                "title",
                "year",
                "author",
            ],
            },
          },
        },
        required: [
          "response",
          "media",
        ],
      },
    },

    input,
  });

    const result = JSON.parse(
    interaction.output_text,
        );

    const resolvedMedia = await Promise.all(
    result.media.map(resolveMediaItem),
    );

    const availableMedia = resolvedMedia
    .filter(Boolean)
    .filter((media) => {
      return !completed[
        media.type
      ]?.has(media.id);
    });

    return {
        response: result.response,
        media: availableMedia,
    };
}
}

export default new AiService();