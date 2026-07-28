import MediaCollectionPage from "../components/media/MediaCollectionPage";
import {
  addGame,
  deleteGame,
  getGames,
  searchGames,
  updateGame,
} from "../services/api.js";
import { getIgdbImageUrl } from "../utils/igdbImages.js";

const gameCollection = {
  heading: "My Games",
  singularName: "Game",
  pluralName: "games",
  searchHeading: "Search games",
  searchPlaceholder: "Search game...",

  relationField: "game",
  externalIdField: "igdbGameId",
  titleField: "name",
  detailsRoute: "game",

  getImageUrl: getIgdbImageUrl,

  statusUi: {
    watched: "Played",
    watchlist: "Want to Play",

    markWatched: "Mark as Played",
    moveToWatchlist: "Move to Want to Play",

    markSearchResultWatched: (title) =>
      `Mark ${title} as played`,

    addSearchResultToWatchlist: (title) =>
      `Add ${title} to Want to Play`,
  },

  api: {
    getAll: getGames,
    add: addGame,
    update: updateGame,
    remove: deleteGame,
    search: searchGames,
  },
};

export default function Games() {
  return (
    <MediaCollectionPage config={gameCollection} />
  );
}