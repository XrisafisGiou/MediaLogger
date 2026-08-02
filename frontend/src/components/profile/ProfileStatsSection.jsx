import StatGrid from "../common/StatGrid";

export default function ProfileStatsSection({
  title,
  entries = [],
  completedLabel,
  plannedLabel,
}) {
  const completed = entries.filter(
    (entry) => entry.status === "watched",
  ).length;

  const planned = entries.filter(
    (entry) => entry.status === "watchlist",
  ).length;

  const favorites = entries.filter(
    (entry) => entry.isFavorite,
  ).length;

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">
        {title}
      </h2>

      <StatGrid
        items={[
          {
            key: "completed",
            label: completedLabel,
            value: completed,
          },
          {
            key: "planned",
            label: plannedLabel,
            value: planned,
          },
          {
            key: "favorites",
            label: "Favorites",
            value: favorites,
          },
        ]}
      />
    </section>
  );
}