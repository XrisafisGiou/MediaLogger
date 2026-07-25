export default function SearchLauncher({
  onOpen,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full rounded border border-white/20 bg-white/10 p-2 text-left text-white/60 ${className}`}
    >
      {placeholder}
    </button>
  );
}
