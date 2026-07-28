import { CalendarDays, Clapperboard, Clock3, Star } from "lucide-react";
import {
  addMovie,
  deleteMovie,
  getMovieCredits,
  getMovieDetails,
  getMovieImages,
  getMovieStatus,
  updateMovie,
} from "../services/api.js";
import MediaDetailsPage from "../components/media/MediaDetailsPage";

function formatRating(rating) {
  return Number.isFinite(rating) ? `${rating.toFixed(1)} / 10` : "N/A";
}

const movieDetailsConfig = {
  labels: {
    loading: "Loading movie...",
    notFound: "Movie not found",
  },
  api: {
    getDetails: getMovieDetails,
    getStatus: getMovieStatus,
    getImages: getMovieImages,
    getCredits: getMovieCredits,
    add: addMovie,
    update: updateMovie,
    remove: deleteMovie,
  },
  getTitle: (movie) => movie.title,
  getMetadata: (movie, credits) => {
    const director = credits?.crew?.find(
      (person) => person.job === "Director",
    )?.name;

    return [
      {
        key: "release-year",
        label: "Release year",
        value: movie.release_date?.slice(0, 4) || "N/A",
        icon: CalendarDays,
      },
      {
        key: "rating",
        label: "Rating",
        value: formatRating(movie.vote_average),
        icon: Star,
      },
      {
        key: "runtime",
        label: "Runtime",
        value: movie.runtime ? `${movie.runtime} min` : "N/A",
        icon: Clock3,
      },
      {
        key: "director",
        label: "Director",
        value: director ? `Directed by ${director}` : "",
        icon: Clapperboard,
      },
    ];
  },
  getCast: (credits) => credits?.cast || [],
  createEntry: (movie, status) => ({
    tmdbMovieId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    status,
    isFavorite: false,
  }),
};

export default function MovieDetails() {
  return <MediaDetailsPage config={movieDetailsConfig} />;
}
