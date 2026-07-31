import {
  Building2,
  CalendarDays,
  Gamepad2,
  Monitor,
  Star,
} from "lucide-react";
import MediaDetailsPage from "../components/media/MediaDetailsPage";
import {
  addGame,
  deleteGame,
  getGameDetails,
  getGameImages,
  getGameStatus,
  updateGame,
} from "../services/api.js";
import { getIgdbImageUrl } from "../utils/igdbImages.js";

function formatReleaseYear(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return "N/A";
  }

  return String(
    new Date(timestamp * 1000).getUTCFullYear(),
  );
}

function formatRating(rating) {
  return Number.isFinite(rating)
    ? `${rating.toFixed(0)} / 100`
    : "N/A";
}

function joinNames(items) {
  return (
    items
      ?.map((item) => item.name)
      .filter(Boolean)
      .join(", ") || ""
  );
}

const gameDetailsConfig = {
  labels: {
    loading: "Loading game...",
    notFound: "Game not found",
  },

  statusUi: {
    markWatched: "Mark as Played",
    removeWatched: "Remove from Played",
    addToWatchlist: "Add to Want to Play",
    removeFromWatchlist:
      "Remove from Want to Play",
  },

  getImageUrl: getIgdbImageUrl,
  watchedIcon: Gamepad2,

  api: {
    getDetails: getGameDetails,
    getStatus: getGameStatus,
    getImages: getGameImages,
    add: addGame,
    update: updateGame,
    remove: deleteGame,
  },

  getTitle: (game) => game.name,

  getMetadata: (game) => {
    const platforms = joinNames(game.platforms);
    const genres = joinNames(game.genres);
    const developers =
      game.developers?.join(", ") || "";

    return [
      {
        key: "release-year",
        label: "Release year",
        value: formatReleaseYear(
          game.first_release_date,
        ),
        icon: CalendarDays,
      },
      {
        key: "rating",
        label: "Rating",
        value: formatRating(game.total_rating),
        icon: Star,
      },
      {
        key: "platforms",
        label: "Platforms",
        value: platforms,
        icon: Monitor,
      },
      {
        key: "genres",
        label: "Genres",
        value: genres,
        icon: Gamepad2,
      },
      {
        key: "developers",
        label: "Developers",
        value: developers
          ? `Developed by ${developers}`
          : "",
        icon: Building2,
      },
    ];
  },

  createEntry: (game, status) => ({
    igdbGameId: game.id,
    name: game.name,
    posterPath: game.poster_path,
    status,
    isFavorite: false,
  }),
};

export default function GameDetails() {
  return (
    <MediaDetailsPage config={gameDetailsConfig} />
  );
}