import ItemArtwork from "./ItemArtwork";

export default function ItemCard({
  title,
  imageSrc,
  imageAlt = title,
  fallbackIcon,
  onOpen,
  actions = [],
  className = "",
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-md border border-white/10 bg-white/10 ${className}`}
    >
      <ItemArtwork
        src={imageSrc}
        alt={imageAlt}
        fallbackIcon={fallbackIcon}
        onClick={onOpen}
      />

      <div className="truncate p-1 text-center text-xs font-semibold">
        {title}
      </div>

      {actions.length > 0 && (
        <div className="flex items-center justify-between gap-1 p-1">
          {actions.map(
            ({
              key,
              icon: Icon,
              label,
              onClick,
              disabled = false,
              className: actionClassName = "",
              iconProps = {},
            }) => (
              <button
                key={key}
                type="button"
                title={label}
                aria-label={label}
                onClick={onClick}
                disabled={disabled}
                className={`flex flex-1 items-center justify-center transition ${actionClassName}`}
              >
                <Icon size={30} aria-hidden="true" {...iconProps} />
              </button>
            ),
          )}
        </div>
      )}
    </article>
  );
}
