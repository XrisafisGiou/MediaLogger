import ItemArtwork from "../common/ItemArtwork";

export default function MediaScreenshotCard({ screenshot, title, getImageUrl }) {
  return (
    <ItemArtwork
      src={getImageUrl(screenshot.file_path, "w780")}
      alt={`${title} screenshot`}
      aspect="landscape"
      className="aspect-video rounded-lg shadow-lg"
    />
  );
}
