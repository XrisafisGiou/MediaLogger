import { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} from "../services/api.js";
import { Eye, Heart, Trash2 } from "lucide-react";

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
          className="border p-2 rounded w-full"
          placeholder="Search movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {searchResults.map((movie) => (
          <div
            key={movie.id}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col"
          >
            <img
                src={
                    item.movie?.posterPath
                    ? `https://image.tmdb.org/t/p/w342${item.movie.posterPath}`
                    : "https://via.placeholder.com/342x513"
                }
                alt={item.movie?.title}
                className="w-full rounded-md object-cover"
            />

            <div className="p-2 text-sm font-semibold text-center">
                {item.movie?.title}
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
              className="bg-green-500 text-white w-full p-2"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={
                item.movie?.posterPath
                  ? `https://image.tmdb.org/t/p/w300${item.movie.posterPath}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={item.movie?.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-3 font-bold text-center">
              {item.movie?.title}
            </div>

            <div className="px-3 text-sm text-gray-600 space-y-1">
              <div>Status: {item.status}</div>
              <div>
                Favorite: {item.isFavorite ? "❤️ Yes" : "No"}
              </div>
            </div>

            <div className="p-2 flex justify-between items-center gap-2">

            <button
                onClick={async () => {
                await updateMovie(item.id, {
                    status: item.status === "watched" ? "watchlist" : "watched",
                    isFavorite: item.isFavorite,
                });

                setMovies(await getMovies());
                }}
                className="flex-1 flex justify-center items-center bg-blue-600/80 hover:bg-blue-600 rounded py-1 transition"
            >
                <Eye size={16} />
            </button>

            <button
                onClick={async () => {
                await updateMovie(item.id, {
                    status: item.status,
                    isFavorite: !item.isFavorite,
                });

                setMovies(await getMovies());
                }}
                className={`flex-1 flex justify-center items-center rounded py-1 transition ${
                item.isFavorite
                    ? "bg-yellow-500/90 hover:bg-yellow-500"
                    : "bg-gray-600/70 hover:bg-gray-600"
                }`}
            >
                <Heart size={16} />
            </button>

            <button
                onClick={async () => {
                await deleteMovie(item.id);
                setMovies(await getMovies());
                }}
                className="flex-1 flex justify-center items-center bg-red-600/80 hover:bg-red-600 rounded py-1 transition"
            >
                <Trash2 size={16} />
            </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}