import { UserRound } from "lucide-react";
import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

function getCharacterNames(actor) {
  const aggregateRoles = Array.isArray(actor.roles)
    ? actor.roles.map((role) => role.character)
    : [];
  const characterNames = aggregateRoles.length
    ? aggregateRoles
    : [actor.character];

  return [
    ...new Set(
      characterNames
        .filter((character) => typeof character === "string")
        .map((character) => character.trim())
        .filter(Boolean),
    ),
  ];
}

export default function CastMemberCard({ actor }) {
  const characterNames = getCharacterNames(actor);

  return (
    <article className="overflow-hidden rounded-lg bg-white/10">
      <ItemArtwork
        src={getTmdbImageUrl(actor.profile_path)}
        alt={actor.name}
        fallbackIcon={UserRound}
      />
      <div className="p-3 text-center">
        <p className="truncate font-semibold">{actor.name}</p>
        {characterNames.length > 0 && (
          <ul className="mt-1 space-y-1 text-sm text-white/60">
            {characterNames.map((character) => (
              <li key={character}>{character}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
