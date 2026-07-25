export default function IconButton({
  icon: Icon,
  label,
  onClick,
  className = "",
  iconSize = 18,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-white/20 bg-white/10 p-2 text-gray-300 transition hover:bg-white/20 hover:text-white ${className}`}
      title={label}
      aria-label={label}
    >
      <Icon size={iconSize} aria-hidden="true" />
    </button>
  );
}
