import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Heart,
  LogOut,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../context/useAuth";
import ConfirmModal from "../ConfirmModal";
import CollectionToolbar from "../common/CollectionToolbar";
import IconButton from "../common/IconButton";
import ItemCard from "../common/ItemCard";
import PageHeader from "../common/PageHeader";
import SearchLauncher from "../common/SearchLauncher";
import SearchModal from "../common/SearchModal";
import PageShell from "../layout/PageShell";

const defaultStatusUi = {
  watched: "Watched",
  watchlist: "Watchlist",
  markWatched: "Mark as Watched",
  moveToWatchlist: "Put in Watchlist",
  markSearchResultWatched: (title) => `Mark ${title} as watched`,
  addSearchResultToWatchlist: (title) => `Add ${title} to watchlist`,
};

const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "alphabetical", label: "Alphabetical" },
];

export default function MediaCollectionPage({ config }) {
  const {
    heading,
    singularName,
    pluralName,
    searchHeading,
    searchPlaceholder,
    relationField,
    externalIdField,
    titleField,
    detailsRoute,
    api,
    statusUi = defaultStatusUi,
    getImageUrl,
    watchedIcon: WatchedIcon,
  } = config;
  const {
    getAll,
    add,
    update,
    remove,
    search,
    getDetails,
  } = api;
  const labels = { ...defaultStatusUi, ...statusUi };
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "watched";
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function loadEntries() {
    setEntries(await getAll());
  }

  useEffect(() => {
    getAll().then(setEntries);
  }, [getAll]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return undefined;
    }

    let isCurrent = true;
    const delay = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");
        const data = await search(searchQuery);

        if (!isCurrent) return;

        const results = data.results || [];
        setSearchResults(results);
        if (!results.length) {
          setSearchError(`No ${pluralName} found.`);
        }
      } catch {
        if (!isCurrent) return;
        setSearchError("Something went wrong.");
        setSearchResults([]);
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    }, 400);

    return () => {
      isCurrent = false;
      clearTimeout(delay);
    };
  }, [pluralName, search, searchQuery]);

  const existingEntries = useMemo(
    () =>
      Object.fromEntries(
        entries.map((entry) => [
          entry[relationField][externalIdField],
          entry,
        ]),
      ),
    [entries, externalIdField, relationField],
  );

  const displayedEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.status === activeTab)
        .sort((first, second) => {
          if (sortOption === "alphabetical") {
            return first[relationField][titleField].localeCompare(
              second[relationField][titleField],
            );
          }

          return sortOption === "recent" ? second.id - first.id : 0;
        }),
    [activeTab, entries, relationField, sortOption, titleField],
  );

  async function addSearchResult(media, status) {
    const detailedMedia = getDetails
      ? await getDetails(media.id)
      : media;

    await add({
      [externalIdField]: detailedMedia.id,
      [titleField]: detailedMedia[titleField],
      posterPath: detailedMedia.poster_path,
      status,
      isFavorite: false,
    });

    await loadEntries();
  }

  function handleSearchQueryChange(value) {
    setSearchQuery(value);

    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchError("");
    }
  }

  async function toggleStatus(entry) {
    await update(entry.id, {
      status: entry.status === "watched" ? "watchlist" : "watched",
      isFavorite: entry.isFavorite,
    });
    await loadEntries();
  }

  async function toggleFavorite(entry) {
    await update(entry.id, {
      status: entry.status,
      isFavorite: !entry.isFavorite,
    });
    await loadEntries();
  }

  function getLibraryActions(entry) {
    return [
      {
        key: "status",
        icon: WatchedIcon,
        label:
          entry.status === "watched"
            ? labels.moveToWatchlist
            : labels.markWatched,
        onClick: () => toggleStatus(entry),
        className:
          entry.status === "watched"
            ? "text-blue-400"
            : "text-gray-400 hover:text-blue-300",
      },
      ...(entry.status === "watched"
        ? [
            {
              key: "favorite",
              icon: Heart,
              label: entry.isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites",
              onClick: () => toggleFavorite(entry),
              className: entry.isFavorite
                ? "text-red-500"
                : "text-gray-400 hover:text-red-400",
              iconProps: {
                fill: entry.isFavorite ? "currentColor" : "none",
              },
            },
          ]
        : []),
      {
        key: "delete",
        icon: Trash2,
        label: "Delete",
        onClick: () => setDeleteTarget(entry),
        className: "text-gray-400 hover:text-red-500",
      },
    ];
  }

  function getSearchActions(media) {
    const existingEntry = existingEntries[media.id];

    if (existingEntry) {
      const isWatched = existingEntry.status === "watched";
      return [
        {
          key: "status",
          icon: isWatched ? WatchedIcon : Bookmark,
          label: isWatched ? labels.watched : labels.watchlist,
          disabled: true,
          className: isWatched ? "text-blue-400" : "text-purple-400",
        },
      ];
    }

    const title = media[titleField];
    return [
      {
        key: "watched",
        icon: WatchedIcon,
        label: labels.markSearchResultWatched(title),
        onClick: () => addSearchResult(media, "watched"),
        className: "text-gray-400 hover:text-blue-300",
      },
      {
        key: "watchlist",
        icon: Bookmark,
        label: labels.addSearchResultToWatchlist(title),
        onClick: () => addSearchResult(media, "watchlist"),
        className: "text-gray-400 hover:text-purple-300",
      },
    ];
  }

  const collectionTabs = [
    { value: "watched", label: labels.watched },
    { value: "watchlist", label: labels.watchlist },
  ];

  return (
    <PageShell contentClassName="p-6">
      <PageHeader title={heading} className="mb-6">
        <IconButton
          icon={User}
          label="Profile"
          onClick={() => navigate("/profile")}
        />
        <IconButton
          icon={Heart}
          label="Favorites"
          onClick={() =>
            navigate("/favorites")
          }
          className="hover:border-red-400 hover:bg-red-500/20 hover:text-red-300"
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

      <SearchLauncher
        onOpen={() => setIsSearchOpen(true)}
        placeholder={searchPlaceholder}
        className="mb-6"
      />

      {isSearchOpen && (
        <SearchModal
          title={searchHeading}
          placeholder={searchPlaceholder}
          query={searchQuery}
          onQueryChange={handleSearchQueryChange}
          onClose={() => setIsSearchOpen(false)}
          items={searchResults}
          getKey={(media) => media.id}
          isLoading={isSearching}
          error={searchError}
          renderItem={(media) => (
            <ItemCard
              title={media[titleField]}
              imageSrc={getImageUrl(media.poster_path)}
              onOpen={() => navigate(`/${detailsRoute}/${media.id}`)}
              actions={getSearchActions(media)}
            />
          )}
        />
      )}

      <CollectionToolbar
        tabs={collectionTabs}
        activeTab={activeTab}
        onTabChange={(tab) => setSearchParams({ tab })}
        sortOptions={sortOptions}
        sortValue={sortOption}
        onSortChange={setSortOption}
        className="mb-6"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
        {displayedEntries.map((entry) => {
          const media = entry[relationField];

          return (
            <ItemCard
              key={entry.id}
              title={media[titleField]}
              imageSrc={getImageUrl(media.posterPath)}
              onOpen={() =>
                navigate(`/${detailsRoute}/${media[externalIdField]}`)
              }
              actions={getLibraryActions(entry)}
            />
          );
        })}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title={`Remove ${singularName}?`}
          message={`Are you sure you want to remove "${
            deleteTarget[relationField][titleField]
          }" from your library?`}
          confirmLabel="Remove"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await remove(deleteTarget.id);
            await loadEntries();
            setDeleteTarget(null);
          }}
        />
      )}
    </PageShell>
  );
}
