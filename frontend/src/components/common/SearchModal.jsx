import { X } from "lucide-react";

export default function SearchModal({
  query,
  onQueryChange,
  onClose,
  items,
  renderItem,
  getKey = (_, index) => index,
  isLoading = false,
  error,
  title = "Search",
  placeholder = "Search...",
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 top-5 z-50 overflow-y-auto bg-black/90 p-6 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="min-h-full w-full p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="mb-4 flex items-center gap-2 text-white"
        >
          <X size={18} aria-hidden="true" />
          Close
        </button>

        <input
          autoFocus
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="mb-6 w-full rounded border border-white/20 bg-white/10 p-3 text-white"
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-300">
            {error}
          </div>
        )}

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
              <p className="text-2xl font-semibold">Searching...</p>
            </div>
          )}

          <div
            className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 ${
              isLoading ? "opacity-30" : "opacity-100"
            }`}
          >
            {items.map((item, index) => (
              <div key={getKey(item, index)}>{renderItem(item, index)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
