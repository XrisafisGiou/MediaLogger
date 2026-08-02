import {
  User,
  LogOut,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Carousel from "../components/common/Carousel";
import IconButton from "../components/common/IconButton";
import ItemCard from "../components/common/ItemCard";
import PageHeader from "../components/common/PageHeader";
import PageShell from "../components/layout/PageShell";
import {
  getBooks,
  getGames,
  getMovies,
  getTvShows,
} from "../services/api.js";
import { getIgdbImageUrl } from "../utils/igdbImages.js";
import { getOpenLibraryImageUrl } from "../utils/openLibraryImages.js";
import { getTmdbImageUrl } from "../utils/tmdbImages.js";

const emptyFavorites = {
  movies: [],
  tvShows: [],
  games: [],
  books: [],
};

export default function Favorites() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [favorites, setFavorites] =
    useState(emptyFavorites);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError("");

        const [
          movies,
          tvShows,
          games,
          books,
        ] = await Promise.all([
          getMovies(),
          getTvShows(),
          getGames(),
          getBooks(),
        ]);

        if (!isCurrent) {
          return;
        }

        setFavorites({
          movies: movies.filter(
            (entry) => entry.isFavorite,
          ),

          tvShows: tvShows.filter(
            (entry) => entry.isFavorite,
          ),

          games: games.filter(
            (entry) => entry.isFavorite,
          ),

          books: books.filter(
            (entry) => entry.isFavorite,
          ),
        });
      } catch {
        if (isCurrent) {
          setError(
            "Failed to load your favorites.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isCurrent = false;
    };
  }, []);

  const sections = [
    {
      key: "movies",
      title: "Movies",
      emptyMessage:
        "No favorite movies yet.",
      entries: favorites.movies,
      relationField: "movie",
      titleField: "title",
      externalIdField: "tmdbMovieId",
      detailsRoute: "movie",
      getImageUrl: getTmdbImageUrl,
    },
    {
      key: "tv-shows",
      title: "TV Shows",
      emptyMessage:
        "No favorite TV shows yet.",
      entries: favorites.tvShows,
      relationField: "tvShow",
      titleField: "name",
      externalIdField: "tmdbTvShowId",
      detailsRoute: "tv",
      getImageUrl: getTmdbImageUrl,
    },
    {
      key: "games",
      title: "Games",
      emptyMessage:
        "No favorite games yet.",
      entries: favorites.games,
      relationField: "game",
      titleField: "name",
      externalIdField: "igdbGameId",
      detailsRoute: "game",
      getImageUrl: getIgdbImageUrl,
    },
    {
      key: "books",
      title: "Books",
      emptyMessage:
        "No favorite books yet.",
      entries: favorites.books,
      relationField: "book",
      titleField: "title",
      externalIdField: "openLibraryId",
      detailsRoute: "book",
      getImageUrl:getOpenLibraryImageUrl,
    },
  ];

  return (
    <PageShell contentClassName="mx-auto max-w-7xl p-4 sm:p-6">
      <PageHeader
        title="My Favorites"
        className="mb-8"
      >
        <IconButton
          icon={User}
          label="Profile"
          onClick={() =>
            navigate("/profile")
          }
        />
        <IconButton
          icon={LogOut}
          label="Logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="hover:border-red-400 hover:bg-red-500/20"
        />
      </PageHeader>

      {isLoading && (
        <p className="text-white/60">
          Loading favorites...
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-10">
          {sections.map((section) => {
            if (!section.entries.length) {
              return (
                <section key={section.key}>
                  <h2 className="mb-4 text-2xl font-bold">
                    {section.title}
                  </h2>

                  <p className="rounded-lg border border-white/10 bg-white/5 p-5 text-white/50">
                    {section.emptyMessage}
                  </p>
                </section>
              );
            }

            return (
              <Carousel
                key={section.key}
                title={section.title}
                items={section.entries}
                slidesPerView={{
                  base: 2,
                  md: 6,
                }}
                getKey={(entry) =>
                  `${section.key}-${entry.id}`
                }
                renderItem={(entry) => {
                  const media =
                    entry[
                      section.relationField
                    ];

                  return (
                    <ItemCard
                      title={
                        media[
                          section.titleField
                        ]
                      }
                      imageSrc={section.getImageUrl(
                        media.posterPath,
                      )}
                      fallbackIcon={
                        section.fallbackIcon
                      }
                      onOpen={() =>
                        navigate(
                          `/${section.detailsRoute}/${
                            media[
                              section
                                .externalIdField
                            ]
                          }`,
                        )
                      }
                    />
                  );
                }}
              />
            );
          })}
        </div>
      )}
    </PageShell>
  );
}