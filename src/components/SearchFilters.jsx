export default function SearchFilters({
  region,
  safe,
  perPage,
  onChange,
}) {
  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <h2 className="text-lg font-semibold text-main mb-4">Search Preferences</h2>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Region */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => onChange({ region: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-main focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="in">India</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="jp">Japan</option>
          </select>
        </div>

        {/* Safe Search */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
            Safe Search
          </label>
          <button
            onClick={() => onChange({ safe: !safe })}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border transition-all ${safe
              ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
              : "bg-white/5 border-white/10 text-muted"
              }`}
          >
            <span className="text-sm font-medium">{safe ? "On" : "Off"}</span>
            <div
              className={`w-8 h-4 rounded-full relative transition-colors ${safe ? "bg-blue-500" : "bg-white/20"
                }`}
            >
              <div
                className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${safe ? "right-1" : "left-1"
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
            Results per page
          </label>
          <div className="flex items-center gap-2">
            {[10].map((num) => (
              <button
                key={num}
                onClick={() => onChange({ perPage: num })}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${perPage === num
                  ? "bg-white/20 border-white/30 text-main shadow-lg"
                  : "bg-white/5 border-white/10 text-muted hover:bg-white/10"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
