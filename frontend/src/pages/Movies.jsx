import { useEffect, useState } from "react";
import { getMovies, addMovie, updateMovie, deleteMovie, searchMovies } from "../services/api.js";

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

  async function handleSubmit(e) {
        e.preventDefault();
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
                                await addMovie({
                                    tmdbMovieId: movie.id,
                                    title: movie.title,
                                    posterPath: movie.poster_path,
                                    status: "watchlist",
                                    isFavorite: false
                                });
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
            <div
                key={movie.id}
                style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                alignItems: "center",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "10px",
                }}
            >
                {/* Poster + Title */}
                <div style={{ textAlign: "center" }}>
                <img
                    src={
                    movie.movie.posterPath
                        ? `https://image.tmdb.org/t/p/w200${movie.movie.posterPath}`
                        : "https://via.placeholder.com/100x150"
                    }
                    alt={movie.movie.title}
                    style={{ width: "100px", borderRadius: "8px" }}
                />

                <div style={{ marginTop: "5px", fontWeight: "bold" }}>
                    {movie.movie.title}
                </div>
                </div>

                {/* Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                    <strong>Status:</strong> {movie.status}
                </div>

                <div>
                    <strong>Favorite:</strong>{" "}
                    {movie.isFavorite ? "Yes ❤️" : "No"}
                </div>

                <button
                    onClick={async () => {
                    await updateMovie(movie.id, {
                        status: movie.status === "watched" ? "watchlist" : "watched",
                        isFavorite: movie.isFavorite,
                    });

                    const updated = await getMovies();
                    setMovies(updated);
                    }}
                >
                    Toggle Status
                </button>

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
                    await deleteMovie(movie.id);

                    const updated = await getMovies();
                    setMovies(updated);
                    }}
                    style={{ color: "red" }}
                >
                    Delete Movie
                </button>
                </div>
            </div>
            ))}
        </div>
    );
}