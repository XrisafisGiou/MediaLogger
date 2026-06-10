import { useEffect, useState } from "react";
import { getMovies } from "../services/api.js";

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getMovies();
      setMovies(data);
    }

    load();
  }, []);

  return (
    <div>
      <h1>Movies</h1>

      {movies.map((m) => (
        <div key={m.id}>
          {m.tmdbMovieId} - {m.status}
        </div>
      ))}
    </div>
  );
}