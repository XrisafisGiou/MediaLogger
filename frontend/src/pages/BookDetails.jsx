import {
  Book,
  Building2,
  CalendarDays,
  UserRound,
  Tags,
} from "lucide-react";
import MediaDetailsPage from "../components/media/MediaDetailsPage";
import {
  addBook,
  deleteBook,
  getBookDetails,
  getBookImages,
  getBookStatus,
  updateBook,
} from "../services/api.js";
import { getGoogleBooksImageUrl } from "../utils/googleBooksImages.js";

function formatAuthors(authors) {
  if (!Array.isArray(authors) || !authors.length) {
    return "Unknown author";
  }

  return authors.join(", ");
}

function formatPageCount(pageCount) {
  return Number.isInteger(pageCount)
    ? `${pageCount} pages`
    : "N/A";
}

function formatCategories(categories) {
  if (
    !Array.isArray(categories) ||
    !categories.length
  ) {
    return "";
  }

  return categories.join(", ");
}

const bookDetailsConfig = {
  getImageUrl: getGoogleBooksImageUrl,
  watchedIcon: Book,

  labels: {
    loading: "Loading book...",
    notFound: "Book not found",
  },

  statusUi: {
    markWatched: "Mark as Read",
    removeWatched: "Remove from Read",
    addToWatchlist: "Add to Reading List",
    removeFromWatchlist:
      "Remove from Reading List",
  },

  api: {
    getDetails: getBookDetails,
    getStatus: getBookStatus,
    getImages: getBookImages,
    add: addBook,
    update: updateBook,
    remove: deleteBook,
  },

  getTitle: (book) =>
    book.subtitle
      ? `${book.title}: ${book.subtitle}`
      : book.title,

  getMetadata: (book) => [
    {
      key: "authors",
      label: "Authors",
      value: formatAuthors(book.authors),
      icon: UserRound,
    },
    {
      key: "publication-date",
      label: "Publication date",
      value:
        book.releaseYear ||
        "N/A",
      icon: CalendarDays,
    },
    {
      key: "page-count",
      label: "Page count",
      value: formatPageCount(book.pageCount),
      icon: Book,
    },
    {
      key: "publisher",
      label: "Publisher",
      value: book.publisher
        ? `Published by ${book.publisher}`
        : "",
      icon: Building2,
    },
    {
      key: "categories",
      label: "Categories",
      value: formatCategories(book.categories),
      icon: Tags,
    },
  ],

  createEntry: (book, status) => ({
    googleBooksId: book.id,
    title: book.title,
    posterPath: book.poster_path,
    status,
    isFavorite: false,
  }),
};

export default function BookDetails() {
  return (
    <MediaDetailsPage
      config={bookDetailsConfig}
    />
  );
}