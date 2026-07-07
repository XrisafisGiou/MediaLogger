import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addMovie, updateMovie, deleteMovie, getMovieDetails, getMovieStatus, getMovieImages, getMovieCredits } from "../services/api.js";
import { Eye, Bookmark, ArrowLeft, UserRound, Clapperboard } from "lucide-react";

const iconSize = 30;

export default function MovieDetails() {
  const { tmdbId } = useParams();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [movieStatus, setMovieStatus] = useState(null);
  const status = movieStatus?.status;
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [cast, setCast] = useState([]);
  const [castIndex, setCastIndex] = useState(0);
  const [director, setDirector] = useState("");
  
 useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      setError("");

      const movieData = await getMovieDetails(tmdbId);
      const statusData = await getMovieStatus(tmdbId);

      setMovie(movieData);
      setMovieStatus(statusData);

      const images = await getMovieImages(tmdbId);
      setScreenshots(images.backdrops?.slice(0, 5) || []);

      const credits = await getMovieCredits(tmdbId);
      setCast(credits.cast?.slice(0, 10) || []);
      setDirector(credits.crew.find(person => person.job === "Director")?.name || "");

    } catch(err) {
      setError("Movie not found");
    } finally {
      setLoading(false);
    }
  }

  load();

}, [tmdbId]);

   if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex flex-col items-center justify-center gap-4">

        <p className="text-lg text-white/70 pulsating">
          Loading movie...
        </p>

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

async function toggleStatus(newStatus) {

  if (movieStatus?.status === newStatus) {

    await deleteMovie(movieStatus.id);

  } else if (movieStatus) {

    await updateMovie(movieStatus.id, {
      status: newStatus,
      isFavorite: movieStatus.isFavorite
    });

  } else {

    await addMovie({
      tmdbMovieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      status: newStatus,
      isFavorite: false
    });

  }


  const updatedStatus = await getMovieStatus(tmdbId);
  setMovieStatus(updatedStatus);
}

function nextScreenshot() {
  setScreenshotIndex((prev) =>
    prev + 1 >= screenshots.length ? 0 : prev + 1
  );
}

function previousScreenshot() {
  setScreenshotIndex((prev) =>
    prev - 1 < 0 ? screenshots.length - 1 : prev - 1
  );
}

function nextActor() {
  setCastIndex((prev) =>
    prev + 1 >= cast.length ? 0 : prev + 1
  );
}

function previousActor() {
  setCastIndex((prev) =>
    prev - 1 < 0 ? cast.length - 1 : prev - 1
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
        onClick={() => navigate(-1)}
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
            <span>•</span>
            <span className="flex items-center gap-1"><Clapperboard size={18} />{director}</span>
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
            className={`flex-1 flex justify-center items-center p-3 rounded transition relative group ${
                status === "watched"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/10 hover:bg-blue-500/20"
            }`}
            >
            <Eye size={18} />

            <span className="absolute -top-10 left-1/2 -translate-x-1/2 
                            hidden group-hover:block 
                            text-xs bg-black/80 text-white px-2 py-1 rounded">
                {status === "watched"
                ? "Remove from Watched"
                : "Mark as Watched"}
            </span>
            </button>

            <button
            onClick={() => toggleStatus("watchlist")}
            className={`flex-1 flex justify-center items-center p-3 rounded transition relative group ${
                status === "watchlist"
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-white/10 hover:bg-purple-500/20"
            }`}
            >
            <Bookmark size={18} />

            <span className="absolute -top-10 left-1/2 -translate-x-1/2 
                            hidden group-hover:block 
                            text-xs bg-black/80 text-white px-2 py-1 rounded">
                {status === "watchlist"
                ? "Remove from Watchlist"
                : "Add to Watchlist"}
            </span>
            </button>

            </div>
        </div>
      </div>
      {screenshots.length > 0 && (
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Screenshots
          </h2>

          <div className="relative">

            <button
              onClick={previousScreenshot}
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                z-10
                bg-black/60 hover:bg-black/80
                rounded-full p-3
              "
            >
              ←
            </button>

            <div className="overflow-hidden mx-10">

              <div
                className="flex gap-4 transition-transform duration-500"
                style={{
                  transform: `translateX(-${screenshotIndex * 33.33}%)`
                }}
              >

                {screenshots.map((screenshot, index) => (
                  <img
                    key={screenshot.file_path || index}
                    src={`https://image.tmdb.org/t/p/w780${screenshot.file_path}`}
                    className="
                      w-full
                      md:w-1/3
                      flex-shrink-0
                      rounded-lg
                      shadow-lg
                      object-cover
                    "
                    alt="Movie screenshot"
                  />
                ))}

              </div>

            </div>

            <button
              onClick={nextScreenshot}
              className="
                absolute right-0 top-1/2 -translate-y-1/2
                z-10
                bg-black/60 hover:bg-black/80
                rounded-full p-3
              "
            >
              →
            </button>
          </div>
        </div>
      )}

      {cast.length > 0 && (
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Cast
          </h2>

          <div className="relative">

            <button
              onClick={previousActor}
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                z-10
                bg-black/60 hover:bg-black/80
                rounded-full p-3
              "
            >
              ←
            </button>


            <div className="overflow-hidden mx-10">

              <div
                className="flex gap-4 transition-transform duration-500"
                style={{
                  transform: `translateX(-${castIndex * 20}%)`
                }}
              >

                {cast.map((actor, index) => (
                  <div
                    key={actor.id || index}
                    className="
                      w-1/2
                      md:w-1/5
                      flex-shrink-0
                      bg-white/10
                      rounded-lg
                      overflow-hidden
                    "
                  >

                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                        className="
                          w-full
                          aspect-[2/3]
                          object-cover
                        "
                        alt={actor.name}
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          aspect-[2/3]
                          flex
                          items-center
                          justify-center
                          bg-white/10
                        "
                      >
                        <UserRound
                          size={80}
                          className="text-white/85"
                        />
                      </div>
                    )}

                    <div className="p-3 text-center">

                      <p className="font-semibold truncate">
                        {actor.name}
                      </p>

                      <p className="text-sm text-white/60 truncate">
                        {actor.character}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>


            <button
              onClick={nextActor}
              className="
                absolute right-0 top-1/2 -translate-y-1/2
                z-10
                bg-black/60 hover:bg-black/80
                rounded-full p-3
              "
            >
              →
            </button>

          </div>

        </div>
      )}
    </div>
</div>
);
}