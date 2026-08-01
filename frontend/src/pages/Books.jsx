import MediaCollectionPage from "../components/media/MediaCollectionPage";
import {
  addBook,
  deleteBook,
  getBookDetails,
  getBooks,
  searchBooks,
  updateBook,
} from "../services/api.js";
import { getOpenLibraryImageUrl } from "../utils/openLibraryImages.js";
import { Book } from "lucide-react";

const bookCollection = {
  heading: "My Books",

  singularName: "Book",
  pluralName: "books",

  searchHeading: "Search books",
  searchPlaceholder: "Search book...",

  relationField: "book",
  externalIdField: "openLibraryId",
  titleField: "title",
  detailsRoute: "book",
  watchedIcon: Book,

  getImageUrl: getOpenLibraryImageUrl,

  statusUi: {
    watched: "Read",
    watchlist: "Reading List",

    markWatched: "Mark as Read",
    moveToWatchlist: "Move to Reading List",

    markSearchResultWatched: (title) =>
      `Mark ${title} as read`,

    addSearchResultToWatchlist: (title) =>
      `Add ${title} to Reading List`,
  },

  api: {
    getAll: getBooks,
    add: addBook,
    update: updateBook,
    remove: deleteBook,
    search: searchBooks,
    getDetails: getBookDetails,
  },
};

export default function Books() {
  return (
    <MediaCollectionPage
      config={bookCollection}
    />
  );
}