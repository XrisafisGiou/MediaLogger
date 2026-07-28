import { Bookmark, Eye } from "lucide-react";
import ActionButtonGroup from "../common/ActionButtonGroup";
import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

const defaultStatusUi = {
  markWatched: "Mark as Watched",
  removeWatched: "Remove from Watched",
  addToWatchlist: "Add to Watchlist",
  removeFromWatchlist: "Remove from Watchlist",
};

export default function MediaDetailsHero({
  title,
  posterPath,
  overview,
  metadata = [],
  status,
  statusUi = defaultStatusUi,
  onToggleStatus,
}) {
  const labels = { ...defaultStatusUi, ...statusUi };
  const statusActions = [
    {
      key: "watched",
      icon: Eye,
      label: status === "watched" ? labels.removeWatched : labels.markWatched,
      onClick: () => onToggleStatus("watched"),
      active: status === "watched",
      activeClassName: "bg-blue-500 text-white shadow-lg",
      inactiveClassName: "bg-white/10 hover:bg-blue-500/20",
    },
    {
      key: "watchlist",
      icon: Bookmark,
      label:
        status === "watchlist"
          ? labels.removeFromWatchlist
          : labels.addToWatchlist,
      onClick: () => onToggleStatus("watchlist"),
      active: status === "watchlist",
      activeClassName: "bg-purple-500 text-white shadow-lg",
      inactiveClassName: "bg-white/10 hover:bg-purple-500/20",
    },
  ];

  const visibleMetadata = metadata.filter(
    ({ value }) => value !== undefined && value !== null && value !== "",
  );

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-72 shrink-0 overflow-hidden rounded-xl shadow-2xl">
        <ItemArtwork src={getTmdbImageUrl(posterPath)} alt={title} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
          {visibleMetadata.map(({ key, label, value, icon: Icon }) => (
            <span
              key={key}
              className="flex items-center gap-1"
              aria-label={label ? `${label}: ${value}` : undefined}
            >
              {Icon && <Icon size={18} aria-hidden="true" />}
              {value}
            </span>
          ))}
        </div>

        <div>
          <h2 className="mb-1 mt-4 text-lg font-semibold">About</h2>
          <p className="max-w-2xl leading-relaxed text-white/80">
            {overview || "No overview is available."}
          </p>
        </div>

        <ActionButtonGroup actions={statusActions} className="mt-4" />
      </div>
    </div>
  );
}
