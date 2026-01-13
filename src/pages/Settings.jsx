import { useEffect, useState } from "react";
import SearchFilters from "../components/SearchFilters";
import { getPrefs, savePrefs } from "../utils/preferences";
import { clearCache, clearRecent, clearSaved, resetAll } from "../utils/reset";

export default function Settings() {
  const [prefs, setPrefs] = useState(() => {
    return (
      getPrefs() || {
        region: "in",
        safe: true,
        perPage: 10,
      }
    );
  });

  const updatePrefs = (patch) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...patch };
      savePrefs(updated);
      return updated;
    });
  };

  // show toast-like alert for now (simple)
  const notify = (msg) => alert(msg);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white/90">Settings</h1>
        <p className="mt-2 text-sm text-white/55">
          Manage your search preferences and app data.
        </p>
      </div>

      {/* Preferences */}
      <div className="mt-6">
        <SearchFilters
          region={prefs.region}
          safe={prefs.safe}
          perPage={prefs.perPage}
          onChange={updatePrefs}
        />
      </div>

      {/* Data actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Clear Recent */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-white/80">
            Search History
          </p>
          <p className="mt-1 text-xs text-white/45">
            Clears recent searches shown as chips/suggestions.
          </p>

          <button
            onClick={() => {
              clearRecent();
              notify("✅ Recent searches cleared");
            }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Recent Searches
          </button>
        </div>

        {/* Clear Cache */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-white/80">Cache</p>
          <p className="mt-1 text-xs text-white/45">
            Clears stored cached search results.
          </p>

          <button
            onClick={() => {
              clearCache();
              notify("✅ Cache cleared");
            }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Cache
          </button>
        </div>

        {/* Clear Saved */}
        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-white/80">Saved Results</p>
          <p className="mt-1 text-xs text-white/45">
            Removes all bookmarked results.
          </p>

          <button
            onClick={() => {
              clearSaved();
              notify("✅ Saved results cleared");
            }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Saved Results
          </button>
        </div>

        {/* Reset All */}
        <div className="glass rounded-3xl p-5 border border-red-400/15">
          <p className="text-sm font-semibold text-red-200">Reset App</p>
          <p className="mt-1 text-xs text-white/45">
            Resets preferences, cache, saved results and history.
          </p>

          <button
            onClick={() => {
              const ok = confirm("Reset everything?");
              if (!ok) return;
              resetAll();
              notify("✅ App reset completed. Reloading…");
              window.location.reload();
            }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15 transition active:scale-95 text-sm"
          >
            Reset Everything
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 glass rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-white/50 leading-relaxed">
          All preferences and saved items are stored locally in your browser.
          Nothing is uploaded to any server.
        </p>
      </div>
    </div>
  );
}
