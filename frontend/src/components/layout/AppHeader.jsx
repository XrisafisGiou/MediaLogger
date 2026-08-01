import { NavLink } from "react-router-dom";

const mediaSections = [
  {
    label: "Movies",
    path: "/movies",
    enabled: true,
  },
  {
    label: "TV Shows",
    path: "/tv-shows",
    enabled: true,
  },
  {
    label: "Games",
    path: "/games",
    enabled: true,
  },
  {
    label: "Books",
    path: "/books",
    enabled: true,
  },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-purple-400/15 bg-gradient-to-r from-slate-950/95 via-purple-950/90 to-slate-950/95 text-white shadow-lg shadow-purple-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 overflow-x-auto px-6 py-3">
        <NavLink
          to="/movies"
          className="flex shrink-0 items-center text-xl font-bold text-purple-400 transition hover:text-purple-300"
        >
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 shrink-0"
          />

          <span>MediaLogger</span>
        </NavLink>

        <nav
          aria-label="Media sections"
          className="flex shrink-0 items-center justify-center gap-2"
        >
          {mediaSections.map((section) =>
            section.enabled ? (
              <NavLink
                key={section.label}
                to={section.path}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {section.label}
              </NavLink>
            ) : (
              <span
                key={section.label}
                aria-disabled="true"
                title="Coming soon"
                className="cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium text-gray-600"
              >
                {section.label}
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}