export default function RecentChips({ items = [], onSelect, onClear }) {
  if (!items.length) return null;

  return (
    <div className="mt-4 glass-soft rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-white/70">Recent searches</p>

        <button
          onClick={onClear}
          className="text-xs text-white/55 hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10 active:scale-95"
            title={item}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
