import MediaCollectionPage from "../components/media/MediaCollectionPage";
import {
  addTvShow,
  deleteTvShow,
  getTvShows,
  searchTvShows,
  updateTvShow,
} from "../services/api.js";
import { Eye } from "lucide-react";
import { getTmdbImageUrl } from "../utils/tmdbImages.js";

const tvShowCollection = {
  heading: "My TV Shows",
  singularName: "TV Show",
  pluralName: "TV shows",
  searchHeading: "Search TV Shows",
  searchPlaceholder: "Search TV show...",
  relationField: "tvShow",
  externalIdField: "tmdbTvShowId",
  titleField: "name",
  detailsRoute: "tv",
  getImageUrl: getTmdbImageUrl,
  watchedIcon: Eye,
  api: {
    getAll: getTvShows,
    add: addTvShow,
    update: updateTvShow,
    remove: deleteTvShow,
    search: searchTvShows,
  },
};

export default function TvShows() {
  return <MediaCollectionPage config={tvShowCollection} />;
}
