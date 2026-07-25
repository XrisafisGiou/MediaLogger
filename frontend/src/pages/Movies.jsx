import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Eye,
  Heart,
  LogOut,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../context/useAuth";
import {
  addMovie,
  deleteMovie,
  getMovies,
  searchMovies,
  updateMovie,
} from "../services/api.js";
import { getTmdbImageUrl } from "../utils/tmdbImages";
import ConfirmModal from "../components/ConfirmModal";
import CollectionToolbar from "../components/common/CollectionToolbar";
import IconButton from "../components/common/IconButton";
import ItemCard from "../components/common/ItemCard";
import PageHeader from "../components/common/PageHeader";
import SearchLauncher from "../components/common/SearchLauncher";
import SearchModal from "../components/common/SearchModal";
import PageShell from "../components/layout/PageShell";

const collectionTabs = [
  { value: "watched", label: "Watched" },
  { value: "watchlist", label: "Watchlist" },
];

const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "alphabetical", label: "Alphabetical" },
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "watched";
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function loadMovies() {
    setMovies(await getMovies());
  }

  useEffect(() => {
    getMovies().then(setMovies);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return undefined;

    const delay = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");
        const data = await searchMovies(searchQuery);
        const results = data.results || [];
        setSearchResults(results);
        if (!results.length) setSearchError("No movies found.");
      } catch {
        setSearchError("Something went wrong.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const existingMovies = useMemo(
    () =>
      Object.fromEntries(
        movies.map((entry) => [entry.movie.tmdbMovieId, entry]),
      ),
    [movies],
  );

  const displayedMovies = useMemo(
    () =>
      movies
        .filter((movie) => movie.status === activeTab)
        .sort((first, second) => {
          if (sortOption === "alphabetical") {
            return first.movie.title.localeCompare(second.movie.title);
          }
          return sortOption === "recent" ? second.id - first.id : 0;
        }),
    [activeTab, movies, sortOption],
  );

  async function addSearchResult(movie, status) {
    await addMovie({
      tmdbMovieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      status,
      isFavorite: false,
    });
    await loadMovies();
  }

  function handleSearchQueryChange(value) {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      setSearchError("");
    }
  }

  async function toggleMovieStatus(entry) {
    await updateMovie(entry.id, {
      status: entry.status === "watched" ? "watchlist" : "watched",
      isFavorite: entry.isFavorite,
    });
    await loadMovies();
  }

  async function toggleFavorite(entry) {
    await updateMovie(entry.id, {
      status: entry.status,
      isFavorite: !entry.isFavorite,
    });
    await loadMovies();
  }

  function getLibraryActions(entry) {
    return [
      {
        key: "status",
        icon: Eye,
        label:
          entry.status === "watched"
            ? "Put in Watchlist"
            : "Mark as Watched",
        onClick: () => toggleMovieStatus(entry),
        className:
          entry.status === "watched"
            ? "text-blue-400"
            : "text-gray-400 hover:text-blue-300",
      },
      ...(entry.status === "watched"
        ? [
            {
              key: "favorite",
              icon: Heart,
              label: entry.isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites",
              onClick: () => toggleFavorite(entry),
              className: entry.isFavorite
                ? "text-red-500"
                : "text-gray-400 hover:text-red-400",
              iconProps: {
                fill: entry.isFavorite ? "currentColor" : "none",
              },
            },
          ]
        : []),
      {
        key: "delete",
        icon: Trash2,
        label: "Delete",
        onClick: () => setDeleteTarget(entry),
        className: "text-gray-400 hover:text-red-500",
      },
    ];
  }

  function getSearchActions(movie) {
    const existingEntry = existingMovies[movie.id];

    if (existingEntry) {
      const isWatched = existingEntry.status === "watched";
      return [
        {
          key: "status",
          icon: isWatched ? Eye : Bookmark,
          label: isWatched ? "Watched" : "Watchlist",
          disabled: true,
          className: isWatched ? "text-blue-400" : "text-purple-400",
        },
      ];
    }

    return [
      {
        key: "watched",
        icon: Eye,
        label: `Mark ${movie.title} as watched`,
        onClick: () => addSearchResult(movie, "watched"),
        className: "text-gray-400 hover:text-blue-300",
      },
      {
        key: "watchlist",
        icon: Bookmark,
        label: `Add ${movie.title} to watchlist`,
        onClick: () => addSearchResult(movie, "watchlist"),
        className: "text-gray-400 hover:text-purple-300",
      },
    ];
  }

  return (
    <PageShell contentClassName="p-6">
      <PageHeader title="My Movies" className="mb-6">
        <IconButton
          icon={User}
          label="Profile"
          onClick={() => navigate("/profile")}
        />
        <IconButton
          icon={LogOut}
          label="Logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="hover:border-red-400 hover:bg-red-500/20"
        />
      </PageHeader>

      <SearchLauncher
        onOpen={() => setIsSearchOpen(true)}
        placeholder="Search movie..."
        className="mb-6"
      />

      {isSearchOpen && (
        <SearchModal
          title="Search movies"
          placeholder="Search movie..."
          query={searchQuery}
          onQueryChange={handleSearchQueryChange}
          onClose={() => setIsSearchOpen(false)}
          items={searchResults}
          getKey={(movie) => movie.id}
          isLoading={isSearching}
          error={searchError}
          renderItem={(movie) => (
            <ItemCard
              title={movie.title}
              imageSrc={getTmdbImageUrl(movie.poster_path)}
              onOpen={() => navigate(`/movie/${movie.id}`)}
              actions={getSearchActions(movie)}
            />
          )}
        />
      )}

      <CollectionToolbar
        tabs={collectionTabs}
        activeTab={activeTab}
        onTabChange={(tab) => setSearchParams({ tab })}
        sortOptions={sortOptions}
        sortValue={sortOption}
        onSortChange={setSortOption}
        className="mb-6"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
        {displayedMovies.map((entry) => (
          <ItemCard
            key={entry.id}
            title={entry.movie.title}
            imageSrc={getTmdbImageUrl(entry.movie.posterPath)}
            onOpen={() => navigate(`/movie/${entry.movie.tmdbMovieId}`)}
            actions={getLibraryActions(entry)}
          />
        ))}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Remove Movie?"
          message={`Are you sure you want to remove "${deleteTarget.movie.title}" from your library?`}
          confirmLabel="Remove"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteMovie(deleteTarget.id);
            await loadMovies();
            setDeleteTarget(null);
          }}
        />
      )}
    </PageShell>
  );
}
