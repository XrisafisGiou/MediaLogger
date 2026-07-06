import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkMovie, addMovie, updateMovie, deleteMovie, getMovieDetails } from "../services/api.js";
import { Eye, Bookmark, ArrowLeft } from "lucide-react";

const iconSize = 30;

export default function MovieDetails() {
  const { tmdbId } = useParams();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dbMovie, setDbMovie] = useState(null);
  const status = dbMovie?.status;
  const isInLibrary = !!status;

  async function toggleStatus(newStatus) {
  try {
    if (!dbMovie) {
      await addMovie({
        tmdbMovieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        status: newStatus,
        isFavorite: false,
      });
    }

    else if (dbMovie.status === newStatus) {
      await deleteMovie(dbMovie.id);
    }

    else {
      await updateMovie(dbMovie.id, {
        status: newStatus,
      });
    }

    const check = await checkMovie(tmdbId);
    setDbMovie(check?.movie || null);

  } catch (err) {
    console.error("toggleStatus failed:", err);
  }
}
  
  useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      setError("");

      const check = await checkMovie(tmdbId);
      setDbMovie(check?.movie || null);

      const data = await getMovieDetails(tmdbId);
      setMovie(data);

    } catch (err) {
      setError("Movie not found");
    } finally {
      setLoading(false);
    }
  }

  load();
}, [tmdbId]);

  if (loading) {
    return (
      <div className="text-white p-6 text-center">
        Loading movie...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

 return (
    <div className="relative min-h-screen text-white overflow-hidden">

    <div
      className="absolute inset-0 bg-cover bg-center blur-sm scale-105 opacity-30"
      style={{
        backgroundImage: movie?.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
      }}
    />

    <div className="absolute inset-0 bg-black/70" />
    <div className="relative z-10 p-6 max-w-6xl mx-auto">

      <button
        onClick={() => navigate("/movies")}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">

        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="w-72 rounded-xl shadow-2xl"
          alt={movie.title}
        />

        <div className="flex flex-col gap-4">

          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <div className="flex gap-3 text-sm text-white/70">
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>•</span>
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>•</span>
            <span>⏱ {movie.runtime ? `${movie.runtime} min` : "N/A"}</span> 
          </div>

          <h2 className="text-lg font-semibold mt-4 mb-1">
            About
          </h2>
          <p className="text-white/80 leading-relaxed max-w-2xl">
            {movie.overview}
          </p>

          <div className="flex gap-3 mt-4">

            <button
                onClick={() => toggleStatus("watched")}
                className={`flex-1 flex justify-center items-center p-3 rounded transition ${
                status === "watched"
                    ? "bg-blue-500/30 text-blue-400"
                    : "bg-white/10 hover:bg-blue-500/20"
                }`}
            >
                <Eye size={18} />
            </button>

            <button
                onClick={() => toggleStatus("watchlist")}
                className={`flex-1 flex justify-center items-center p-3 rounded transition ${
                status === "watchlist"
                    ? "bg-purple-500/30 text-purple-300"
                    : "bg-white/10 hover:bg-purple-500/20"
                }`}
            >
                <Bookmark size={18} />
            </button>

            </div>
        </div>
      </div>
    </div>
</div>
);
}