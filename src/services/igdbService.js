import igdbClient from "../clients/igdbClient.js";
import {
  ExternalServiceError,
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";

const ALLOWED_GAME_TYPES = new Set([
  "Main Game",
  "Standalone Expansion",
  "Remake",
  "Remaster",
  "Expanded Game",
  "Expansion",
]);
let allowedGameTypeIds = null;

function escapeSearchQuery(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}

function parseGameId(id) {
  const gameId = Number(id);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new ValidationError("Invalid game ID");
  }

  return gameId;
}

function normalizeSearchResult(game) {
  return {
    id: game.id,
    name: game.name,
    poster_path: game.cover?.image_id ?? null,
  };
}

function normalizeGameDetails(game) {
  const involvedCompanies =
    game.involved_companies || [];

  const developers = involvedCompanies
    .filter((entry) => entry.developer)
    .map((entry) => entry.company?.name)
    .filter(Boolean);

  const publishers = involvedCompanies
    .filter((entry) => entry.publisher)
    .map((entry) => entry.company?.name)
    .filter(Boolean);

  return {
    ...game,

    // Generic MediaDetailsPage-compatible fields
    overview: game.summary || game.storyline || "",
    poster_path: game.cover?.image_id ?? null,
    backdrop_path:
      game.screenshots?.[0]?.image_id ??
      game.artworks?.[0]?.image_id ??
      null,

    developers,
    publishers,
  };
}

export class IgdbService {
  constructor(client = igdbClient) {
    this.client = client;
  }

  async searchGames(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return {
      results: [],
    };
  }

  const gameTypeIds =
    await this.getAllowedGameTypeIds();

  const games = await this.requestGames(
    `
      search "${escapeSearchQuery(trimmedQuery)}";

      fields
        id,
        name,
        cover.image_id,
        game_type,
        game_type.type,
        version_parent,
        parent_game;

      where
        game_type = (${gameTypeIds.join(",")})
        & version_parent = null
        & cover != null;

      limit 20;
    `,
    "Failed to search games",
  );

  return {
    results: games.map(normalizeSearchResult),
  };
}

  async getGameDetails(id) {
    const gameId = parseGameId(id);

    const games = await this.requestGames(
      `
        fields
          id,
          name,
          summary,
          storyline,
          cover.image_id,
          screenshots.image_id,
          artworks.image_id,
          first_release_date,
          total_rating,
          total_rating_count,
          genres.name,
          platforms.name,
          involved_companies.company.name,
          involved_companies.developer,
          involved_companies.publisher;

        where id = ${gameId};
        limit 1;
      `,
      "Failed to fetch game details",
    );

    const game = games[0];

    if (!game) {
      throw new NotFoundError("Game not found");
    }

    return normalizeGameDetails(game);
  }

  async getGameImages(id) {
    const gameId = parseGameId(id);

    const games = await this.requestGames(
      `
        fields screenshots.image_id;
        where id = ${gameId};
        limit 1;
      `,
      "Failed to fetch game images",
    );

    const screenshots = games[0]?.screenshots || [];

    return {
      backdrops: screenshots.map((screenshot) => ({
        file_path: screenshot.image_id,
      })),
    };
  }

  requestGames(query, errorMessage) {
  return this.request(
    "/games",
    query,
    errorMessage,
  );
}

  async request(endpoint, query, errorMessage) {
  try {
    const response = await this.client.post(
      endpoint,
      query,
    );

    return response.data;
  } catch (error) {
    console.error(
      "IGDB error:",
      error.response?.status,
      error.response?.data,
    );

    throw new ExternalServiceError(errorMessage, {
      cause: error,
    });
  }
}
async getAllowedGameTypeIds() {
  if (allowedGameTypeIds) {
    return allowedGameTypeIds;
  }

  const gameTypes = await this.request(
    "/game_types",
    `
      fields id, type;
      limit 50;
    `,
    "Failed to fetch IGDB game types",
  );

  allowedGameTypeIds = gameTypes
    .filter((gameType) =>
      ALLOWED_GAME_TYPES.has(gameType.type),
    )
    .map((gameType) => gameType.id);

  if (!allowedGameTypeIds.length) {
    throw new ExternalServiceError(
      "No supported IGDB game types were found",
    );
  }

  console.log(
    "Allowed IGDB game types:",
    gameTypes.filter((gameType) =>
      allowedGameTypeIds.includes(gameType.id),
    ),
  );

  return allowedGameTypeIds;
}
}

export default new IgdbService();