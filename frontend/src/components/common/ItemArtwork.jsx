import { ImageOff } from "lucide-react";

export default function ItemArtwork({
  src,
  alt,
  aspect = "portrait",
  fallbackIcon: FallbackIcon = ImageOff,
  onClick,
  className = "",
  fallbackClassName = "",
}) {
  const aspectClass = aspect === "landscape" ? "aspect-video" : "aspect-[2/3]";
  const interactiveClass = onClick
    ? "cursor-pointer transition hover:opacity-90"
    : "";

  if (!src) {
    return (
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(event) => {
          if (onClick && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick();
          }
        }}
        aria-label={onClick ? alt : undefined}
        className={`flex w-full items-center justify-center bg-white/10 ${aspectClass} ${interactiveClass} ${fallbackClassName}`}
      >
        <FallbackIcon size={60} className="text-white/85" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={`w-full object-cover ${aspectClass} ${interactiveClass} ${className}`}
    />
  );
}
