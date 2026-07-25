import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addMovie,
  deleteMovie,
  getMovieCredits,
  getMovieDetails,
  getMovieImages,
  getMovieStatus,
  updateMovie,
} from "../services/api.js";
import BackButton from "../components/common/BackButton";
import Carousel from "../components/common/Carousel";
import PageShell from "../components/layout/PageShell";
import CastMemberCard from "../components/movies/CastMemberCard";
import MovieDetailsHero from "../components/movies/MovieDetailsHero";
import ScreenshotCard from "../components/movies/ScreenshotCard";

export default function MovieDetails() {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [movieStatus, setMovieStatus] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [movieData, statusData, images, credits] = await Promise.all([
          getMovieDetails(tmdbId),
          getMovieStatus(tmdbId),
          getMovieImages(tmdbId),
          getMovieCredits(tmdbId),
        ]);

        setMovie(movieData);
        setMovieStatus(statusData);
        setScreenshots(images.backdrops?.slice(0, 5) || []);
        setCast(credits.cast?.slice(0, 10) || []);
        setDirector(
          credits.crew?.find((person) => person.job === "Director")?.name || "",
        );
      } catch {
        setError("Movie not found");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tmdbId]);

  async function toggleStatus(newStatus) {
    if (movieStatus?.status === newStatus) {
      await deleteMovie(movieStatus.id);
    } else if (movieStatus) {
      await updateMovie(movieStatus.id, {
        status: newStatus,
        isFavorite: movieStatus.isFavorite,
      });
    } else {
      await addMovie({
        tmdbMovieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        status: newStatus,
        isFavorite: false,
      });
    }

    setMovieStatus(await getMovieStatus(tmdbId));
  }

  if (loading) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center">
        <p className="text-lg text-white/70">Loading movie...</p>
      </PageShell>
    );
  }

  if (error || !movie) {
    return (
      <PageShell contentClassName="p-6 text-center text-red-400">
        {error || "Movie not found"}
      </PageShell>
    );
  }

  const backgroundImage = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : undefined;

  return (
    <PageShell
      backgroundImage={backgroundImage}
      contentClassName="mx-auto max-w-6xl p-6"
    >
      <BackButton onClick={() => navigate(-1)} className="mb-6" />

      <MovieDetailsHero
        movie={movie}
        director={director}
        status={movieStatus?.status}
        onToggleStatus={toggleStatus}
      />

      <Carousel
        title="Screenshots"
        items={screenshots}
        getKey={(screenshot, index) => screenshot.file_path || index}
        renderItem={(screenshot) => (
          <ScreenshotCard screenshot={screenshot} movieTitle={movie.title} />
        )}
        slidesPerView={{ base: 1, md: 3 }}
        className="mt-10"
      />

      <Carousel
        title="Cast"
        items={cast}
        getKey={(actor, index) => actor.id || index}
        renderItem={(actor) => <CastMemberCard actor={actor} />}
        slidesPerView={{ base: 2, md: 5 }}
        className="mt-10"
      />
    </PageShell>
  );
}
