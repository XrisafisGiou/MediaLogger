import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

export default function MediaScreenshotCard({ screenshot, title, getImageUrl = getTmdbImageUrl }) {
  return (
    <ItemArtwork
      src={getImageUrl(screenshot.file_path, "w780")}
      alt={`${title} screenshot`}
      aspect="landscape"
      className="aspect-video rounded-lg shadow-lg"
    />
  );
}
