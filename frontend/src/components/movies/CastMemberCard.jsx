import { UserRound } from "lucide-react";
import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

export default function CastMemberCard({ actor }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white/10">
      <ItemArtwork
        src={getTmdbImageUrl(actor.profile_path)}
        alt={actor.name}
        fallbackIcon={UserRound}
      />
      <div className="p-3 text-center">
        <p className="truncate font-semibold">{actor.name}</p>
        <p className="truncate text-sm text-white/60">{actor.character}</p>
      </div>
    </article>
  );
}
