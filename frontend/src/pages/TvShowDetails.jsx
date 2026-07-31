import {
  CalendarDays,
  Clapperboard,
  Clock3,
  Layers3,
  Star,
  Eye,
} from "lucide-react";
import {
  addTvShow,
  deleteTvShow,
  getTvShowCredits,
  getTvShowDetails,
  getTvShowImages,
  getTvShowStatus,
  updateTvShow,
} from "../services/api.js";
import MediaDetailsPage from "../components/media/MediaDetailsPage";
import { getTmdbImageUrl } from "../utils/tmdbImages.js";

function formatRating(rating) {
  return Number.isFinite(rating) ? `${rating.toFixed(1)} / 10` : "N/A";
}

function getEpisodeRuntime(tvShow) {
  return tvShow.episode_run_time?.[0] ?? tvShow.last_episode_to_air?.runtime;
}

const tvShowDetailsConfig = {
  getImageUrl: getTmdbImageUrl,
  watchedIcon: Eye,
  labels: {
    loading: "Loading TV show...",
    notFound: "TV show not found",
  },
  api: {
    getDetails: getTvShowDetails,
    getStatus: getTvShowStatus,
    getImages: getTvShowImages,
    getCredits: getTvShowCredits,
    add: addTvShow,
    update: updateTvShow,
    remove: deleteTvShow,
  },
  getTitle: (tvShow) => tvShow.name,
  getMetadata: (tvShow) => {
    const episodeRuntime = getEpisodeRuntime(tvShow);
    const creators = tvShow.created_by
      ?.map((creator) => creator.name)
      .filter(Boolean)
      .join(", ");
    const seasonCount = tvShow.number_of_seasons;

    return [
      {
        key: "first-air-year",
        label: "First air year",
        value: tvShow.first_air_date?.slice(0, 4) || "N/A",
        icon: CalendarDays,
      },
      {
        key: "rating",
        label: "Rating",
        value: formatRating(tvShow.vote_average),
        icon: Star,
      },
      {
        key: "episode-runtime",
        label: "Episode runtime",
        value: episodeRuntime ? `${episodeRuntime} min episodes` : "N/A",
        icon: Clock3,
      },
      {
        key: "seasons",
        label: "Seasons",
        value: seasonCount
          ? `${seasonCount} ${seasonCount === 1 ? "season" : "seasons"}`
          : "",
        icon: Layers3,
      },
      {
        key: "creators",
        label: "Creators",
        value: creators ? `Created by ${creators}` : "",
        icon: Clapperboard,
      },
    ];
  },
  getCast: (credits) => credits?.cast || [],
  createEntry: (tvShow, status) => ({
    tmdbTvShowId: tvShow.id,
    name: tvShow.name,
    posterPath: tvShow.poster_path,
    status,
    isFavorite: false,
  }),
};

export default function TvShowDetails() {
  return <MediaDetailsPage config={tvShowDetailsConfig} />;
}
