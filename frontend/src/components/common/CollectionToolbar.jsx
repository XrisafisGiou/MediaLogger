export default function CollectionToolbar({
  tabs,
  activeTab,
  onTabChange,
  sortOptions,
  sortValue,
  onSortChange,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={`rounded-full border px-5 py-2 transition ${
            activeTab === tab.value
              ? "border-purple-600 bg-purple-600 text-white"
              : "border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {tab.label}
        </button>
      ))}

      <select
        value={sortValue}
        onChange={(event) => onSortChange(event.target.value)}
        className="ml-auto rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
        aria-label="Sort collection"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-black">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
