import ItemArtwork from "../common/ItemArtwork";
import { getTmdbImageUrl } from "../../utils/tmdbImages";

export default function ScreenshotCard({ screenshot, movieTitle }) {
  return (
    <ItemArtwork
      src={getTmdbImageUrl(screenshot.file_path, "w780")}
      alt={`${movieTitle} screenshot`}
      aspect="landscape"
      className="aspect-video rounded-lg shadow-lg"
    />
  );
}
