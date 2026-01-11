export default function SearchFilters({
  region,
  safe,
  perPage,
  onChange,
}) {
  return (
    <div className="glass rounded-3xl p-4 sm:p-5 border border-white/10">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-white/80">
          Filters
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
          {/* Region */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-white/50">Region</span>
            <select
              value={region}
              onChange={(e) =>
                onChange({ region: e.target.value })
              }
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="in" className="bg-zinc-900">India (IN)</option>
              <option value="us" className="bg-zinc-900">USA (US)</option>
              <option value="gb" className="bg-zinc-900">UK (GB)</option>
              <option value="ca" className="bg-zinc-900">Canada (CA)</option>
              <option value="au" className="bg-zinc-900">Australia (AU)</option>
            </select>
          </label>

          {/* SafeSearch */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-white/50">Safe Search</span>
            <button
              onClick={() => onChange({ safe: !safe })}
              className={`rounded-xl border px-3 py-2 text-sm transition active:scale-95 ${
                safe
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                  : "border-white/15 bg-white/10 text-white/80 hover:bg-white/15"
              }`}
              type="button"
            >
              {safe ? "Enabled ✅" : "Disabled"}
            </button>
          </label>

          {/* Per page */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-white/50">Results / page</span>
            <select
              value={perPage}
              onChange={(e) =>
                onChange({ perPage: Number(e.target.value) })
              }
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value={10} className="bg-zinc-900">10</option>
              <option value={20} className="bg-zinc-900">20</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-white/45">
        Filters are saved automatically and apply to future searches.
      </p>
    </div>
  );
}
