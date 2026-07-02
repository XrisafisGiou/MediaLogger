import { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} from "../services/api.js";

import { Eye, Heart, Trash2 } from "lucide-react";

const iconSize = 25;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function loadMovies() {
    const data = await getMovies();
    setMovies(data);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    const data = await searchMovies(searchQuery);
    setSearchResults(data.results);
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-purple-950 to-black text-white">

      <h1 className="text-3xl font-bold mb-6">My Movies</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          className="border border-white/20 bg-white/10 text-white p-2 rounded w-full"
          placeholder="Search movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-purple-600 px-4 rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 mb-10">

        {searchResults.map((movie) => (
          <div
            key={movie.id}
            className="bg-white/10 border border-white/10 rounded-md overflow-hidden"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : "https://via.placeholder.com/342x513"
              }
              alt={movie.title}
              className="w-full object-cover"
            />

            <div className="p-1 text-xs font-semibold text-center truncate">
              {movie.title}
            </div>

            <button
              onClick={async () => {
                await addMovie({
                  tmdbMovieId: movie.id,
                  title: movie.title,
                  posterPath: movie.poster_path,
                  status: "watchlist",
                  isFavorite: false,
                });

                loadMovies();
              }}
              className="w-full bg-green-600 text-[10px] py-1"
            >
              Add
            </button>
          </div>
        ))}

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white/10 border border-white/10 rounded-md overflow-hidden flex flex-col"
          >

            <img
              src={
                movie.movie?.posterPath
                  ? `https://image.tmdb.org/t/p/w342${movie.movie.posterPath}`
                  : "https://via.placeholder.com/342x513"
              }
              alt={movie.movie?.title}
              className="w-full object-cover"
            />

            <div className="p-1 text-xs font-semibold text-center truncate">
              {movie.movie?.title}
            </div>

            <div className="p-1 flex justify-between items-center gap-1">

              <button
                title={
                  movie.status === "watched"
                    ? "Put in Watchlist"
                    : "Mark as Watched"
                }
                onClick={async () => {
                  await updateMovie(movie.id, {
                    status:
                      movie.status === "watched"
                        ? "watchlist"
                        : "watched",
                    isFavorite: movie.isFavorite,
                  });

                  setMovies(await getMovies());
                }}
                className={`flex-1 flex justify-center items-center transition ${
                  movie.status === "watched"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-blue-300"
                }`}
              >
                <Eye size={iconSize} />
              </button>

              <button
                title={
                    movie.isFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                onClick={async () => {
                    await updateMovie(movie.id, {
                    status: movie.status,
                    isFavorite: !movie.isFavorite,
                    });

                    setMovies(await getMovies());
                }}
                className="flex-1 flex justify-center items-center transition"
                >
                <Heart
                    size={iconSize}
                    fill={movie.isFavorite ? "currentColor" : "none"}
                    className={
                    movie.isFavorite
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }
                />
                </button>

              <button
                title="Delete"
                onClick={async () => {
                  await deleteMovie(movie.id);
                  setMovies(await getMovies());
                }}
                className="flex-1 flex justify-center items-center text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={iconSize} />
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}