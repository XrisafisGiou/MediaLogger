import MediaCollectionPage from "../components/media/MediaCollectionPage";
import {
  addMovie,
  deleteMovie,
  getMovies,
  searchMovies,
  updateMovie,
} from "../services/api.js";

const movieCollection = {
  heading: "My Movies",
  singularName: "Movie",
  pluralName: "movies",
  searchHeading: "Search movies",
  searchPlaceholder: "Search movie...",
  relationField: "movie",
  externalIdField: "tmdbMovieId",
  titleField: "title",
  detailsRoute: "movie",
  api: {
    getAll: getMovies,
    add: addMovie,
    update: updateMovie,
    remove: deleteMovie,
    search: searchMovies,
  },
};

export default function Movies() {
  return <MediaCollectionPage config={movieCollection} />;
}
