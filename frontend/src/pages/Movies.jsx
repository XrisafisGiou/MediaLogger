import { useEffect, useState } from "react";
import { getMovies, addMovie, updateMovie, deleteMovie, searchMovies } from "../services/api.js";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [tmdbMovieId, setTmdbMovieId] = useState("");
  const [status, setStatus] = useState("watchlist");
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function loadMovies() {
        const data = await getMovies();
        setMovies(data);
  }

  useEffect(() => {
        loadMovies();
  }, []);

  async function handleSubmit(e) {
        e.preventDefault();

        await addMovie(Number(tmdbMovieId), status, isFavorite);

        setTmdbMovieId("");

        loadMovies();
    }

  async function handleSearch(e) {
    e.preventDefault();

    const data = await searchMovies(searchQuery);
    setSearchResults(data.results);
}

  return (
        <div>
            <h1>My Movies</h1>

            <h2>Search Movies</h2>

            <form onSubmit={handleSearch}>
                <input
                    placeholder="Search movie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button type="submit">Search</button>
            </form>

            <div>
                {searchResults.map((movie) => (
                    <div key={movie.id}>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            width="80"
                        />

                        <div>{movie.title}</div>

                        <button
                            onClick={async () => {
                                await addMovie(movie.id, "watchlist", false);
                                loadMovies();
                            }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
            <hr />

            {movies.map((movie) => (
            <div key={movie.id}>
                Movie ID: {movie.tmdbMovieId} | {movie.status} 
                <button
                    onClick={async () => {
                        await updateMovie(movie.id, {
                            status: movie.status=="watched" ? "watchlist" : "watched",
                            isFavorite: movie.isFavorite
                        });

                        const updated = await getMovies();
                        setMovies(updated);
                    }}
                > Toggle Status</button>
                | Favorite:{" "}
                {movie.isFavorite ? "Yes" : "No"}

                <button
                    onClick={async () => {
                        await updateMovie(movie.id, {
                            status: movie.status,
                            isFavorite: !movie.isFavorite,
                        });

                        const updated = await getMovies();
                        setMovies(updated);
                    }}
                >
                    Toggle Favorite
                </button>

                <button
                    onClick={async () => {
                        await deleteMovie(movie.id)

                        const updated = await getMovies();
                        setMovies(updated);
                    }}
                >
                    Delete Movie
                </button>
            </div>
        ))}
        </div>
    );
}