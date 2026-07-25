import { Bookmark, Clapperboard, Eye } from "lucide-react";
import ActionButtonGroup from "../common/ActionButtonGroup";
import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

export default function MovieDetailsHero({
  movie,
  director,
  status,
  onToggleStatus,
}) {
  const statusActions = [
    {
      key: "watched",
      icon: Eye,
      label:
        status === "watched" ? "Remove from Watched" : "Mark as Watched",
      onClick: () => onToggleStatus("watched"),
      active: status === "watched",
      activeClassName: "bg-blue-500 text-white shadow-lg",
      inactiveClassName: "bg-white/10 hover:bg-blue-500/20",
    },
    {
      key: "watchlist",
      icon: Bookmark,
      label:
        status === "watchlist" ? "Remove from Watchlist" : "Add to Watchlist",
      onClick: () => onToggleStatus("watchlist"),
      active: status === "watchlist",
      activeClassName: "bg-purple-500 text-white shadow-lg",
      inactiveClassName: "bg-white/10 hover:bg-purple-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-72 shrink-0 overflow-hidden rounded-xl shadow-2xl">
        <ItemArtwork
          src={getTmdbImageUrl(movie.poster_path)}
          alt={movie.title}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{movie.title}</h1>

        <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-white/70">
          <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
          <span aria-hidden="true">•</span>
          <span>★ {movie.vote_average?.toFixed(1) || "N/A"}</span>
          <span aria-hidden="true">•</span>
          <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
          {director && (
            <>
              <span aria-hidden="true">•</span>
              <span className="flex items-center gap-1">
                <Clapperboard size={18} aria-hidden="true" />
                {director}
              </span>
            </>
          )}
        </div>

        <div>
          <h2 className="mb-1 mt-4 text-lg font-semibold">About</h2>
          <p className="max-w-2xl leading-relaxed text-white/80">
            {movie.overview || "No overview is available."}
          </p>
        </div>

        <ActionButtonGroup actions={statusActions} className="mt-4" />
      </div>
    </div>
  );
}
