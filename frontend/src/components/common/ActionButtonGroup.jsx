export default function ActionButtonGroup({ actions, className = "" }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {actions.map(
        ({
          key,
          icon: Icon,
          label,
          onClick,
          active = false,
          activeClassName = "bg-purple-500 text-white shadow-lg",
          inactiveClassName = "bg-white/10 hover:bg-white/20",
        }) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            className={`group relative flex flex-1 items-center justify-center rounded p-3 transition ${
              active ? activeClassName : inactiveClassName
            }`}
            aria-label={label}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs text-white group-hover:block">
              {label}
            </span>
          </button>
        ),
      )}
    </div>
  );
}
