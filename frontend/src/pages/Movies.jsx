import { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} from "../services/api.js";
import { Eye, Heart, Trash2, LogOut, Bookmark, User } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal.jsx";

const iconSize = 30;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "watched";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [existingMovies, setExistingMovies] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortOption, setSortOption] = useState("recent");

  async function loadMovies() {
    const data = await getMovies();
    setMovies(data);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        const data = await searchMovies(searchQuery);

        const results = data.results || [];
        setSearchResults(results);

        if (results.length === 0) {
          setSearchError("No movies found.");
        }
      } catch (err) {
        setSearchError("Something went wrong.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delay);
}, [searchQuery]);

useEffect(() => {
  async function loadExisting() {
    const data = await getMovies();

    const map = {};
    data.forEach((m) => {
      map[m.movie.tmdbMovieId] = {
        status: m.status,
      };
    });

    setExistingMovies(map);
  }

  loadExisting();
}, [movies]);

  const displayedMovies = movies.filter((movie) => movie.status === activeTab).sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.movie.title.localeCompare(b.movie.title);
    }

    if (sortOption === "recent") {
      return b.id - a.id;
    }

    return 0;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-purple-950 to-black text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Movies</h1>

        <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition"
              title="Profile"
            >
              <User size={18} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 border border-white/20 hover:bg-red-500/20 hover:border-red-400 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search movie..."
          className="border border-white/20 bg-white/10 text-white p-2 rounded w-full cursor-pointer"
          readOnly
        />
      </div>

    {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 p-6 overflow-y-auto"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full min-h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-white mb-4"
            >
              ✕ Close
            </button>

            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movie..."
              className="w-full p-3 rounded bg-white/10 text-white border border-white/20 mb-6"
            />

            {searchError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-300">
                {searchError}
              </div>
            )}

            <div className="relative">

              {isSearching && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">

                  <p className="text-2xl font-semibold">
                    Searching movies...
                  </p>

                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 opacity-100">

                {searchResults.map((movie) => {
                  const statusInfo = existingMovies[movie.id];
                  const isInLibrary = !!statusInfo;

                  return (
                    <div
                      key={movie.id}
                      className="bg-white/10 rounded overflow-hidden"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        className="w-full cursor-pointer"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      />

                      {isInLibrary ? (
                      <div className="text-xs text-center text-green-400 py-2">
                        {statusInfo.status === "watched" ? (
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>Watched</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <Bookmark size={14} />
                            <span>Watchlist</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 p-2">

                        <button
                          onClick={async () => {
                            await addMovie({
                              tmdbMovieId: movie.id,
                              title: movie.title,
                              posterPath: movie.poster_path,
                              status: "watched",
                              isFavorite: false,
                            });

                            loadMovies();
                          }}
                          className="flex-1 flex justify-center p-2 rounded bg-white/10 hover:bg-blue-500/30"
                        >
                          <Eye size={18} />
                        </button>

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
                          className="flex-1 flex justify-center p-2 rounded bg-white/10 hover:bg-purple-500/30"
                        >
                          <Bookmark size={18} />
                        </button>

                      </div>
                    )}
                    </div>
                  );
                })}

              </div>

            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3 mb-6">

      <button
        onClick={() => setSearchParams({ tab: "watched" })}
        className={`px-5 py-2 rounded-full border transition ${
          activeTab === "watched"
            ? "bg-purple-600 border-purple-600 text-white"
            : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
        }`}
      >
        Watched
      </button>

      <button
        onClick={() => setSearchParams({ tab: "watchlist" })}
        className={`px-5 py-2 rounded-full border transition ${
          activeTab === "watchlist"
            ? "bg-purple-600 border-purple-600 text-white"
            : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
        }`}
      >
        Watchlist
      </button>

       <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="
            ml-auto
            bg-white/10
            border border-white/20
            rounded-lg
            px-3
            py-2
            text-white
          "
        >
          <option value="recent" className="bg-black">
            Recently Added
          </option>

          <option value="alphabetical" className="bg-black">
            Alphabetical
          </option>

        </select>

    </div>
    
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">

        {displayedMovies.map((movie) => (
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
              className="w-full object-cover cursor-pointer"
              onClick={() =>
                navigate(`/movie/${movie.movie.tmdbMovieId}`)
              }
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

              {movie.status === "watched" && (
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
                  className="flex-1 flex justify-center"
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
              )}

              <button
                title="Delete"
                onClick={() => setDeleteTarget(movie)}
                className="flex-1 flex justify-center items-center text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={iconSize} />
              </button>

            </div>

          </div>
        ))}

      </div>
      {deleteTarget && (
        <ConfirmModal
          title="Remove Movie?"
          message={`Are you sure you want to remove "${deleteTarget.movie?.title}" from your library?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteMovie(deleteTarget.id);
            setMovies(await getMovies());
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}