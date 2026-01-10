export default function SuggestionsPanel({
  recent = [],
  trending = [],
  onSelect,
  onClear,
}) {
  const hasRecent = recent.length > 0;

  return (
    <div className="glass rounded-2xl p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">
          Suggestions
        </h3>

        {hasRecent && (
          <button
            onClick={onClear}
            className="text-xs text-white/60 hover:text-white"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {hasRecent && (
        <div className="mt-4">
          <p className="text-xs text-white/50 mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Suggestions */}
      <div className="mt-4">
        <p className="text-xs text-white/50 mb-2">Trending</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {trending.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-white/75 hover:bg-white/10"
            >
              🔥 {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
