import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import SearchFilters from "../components/SearchFilters";
import { getPrefs, savePrefs } from "../utils/preferences";
import { clearCache, clearRecent, clearSaved, resetAll } from "../utils/reset";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [prefs, setPrefs] = useState(() => getPrefs(user?.id));

  const updatePrefs = (patch) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...patch };
      savePrefs(updated, user?.id);
      return updated;
    });
  };

  const notify = (msg) => alert(msg);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Title */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold text-main">Settings</h1>
        <p className="text-muted mt-2">
          Customize your search experience and manage local data.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Account Info */}
        {user && (
          <div className="glass rounded-3xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-main mb-4">Account</h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-main text-sm">{user.email}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest mt-0.5">Signed In</p>
              </div>
              <button
                onClick={async () => { await signOut(); window.location.href = "/login"; }}
                className="px-4 py-2 rounded-xl border border-red-400/20 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-main mb-4">Appearance</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${theme === "light"
                ? "bg-white/20 border-white/30 text-main shadow-lg"
                : "bg-white/5 border-white/10 text-muted hover:bg-white/10"
                }`}
            >
              <Sun size={20} />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${theme === "dark"
                ? "bg-white/20 border-white/30 text-main shadow-lg"
                : "bg-white/5 border-white/10 text-muted hover:bg-white/10"
                }`}
            >
              <Moon size={20} />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <SearchFilters
          region={prefs?.region}
          safe={prefs?.safe}
          perPage={prefs?.perPage}
          onChange={updatePrefs}
        />
      </div>

      {/* Data actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-main">Search History</p>
          <p className="mt-1 text-xs text-muted">
            Clears recent searches shown as chips/suggestions.
          </p>
          <button
            onClick={() => { clearRecent(user?.id); notify("✅ Recent searches cleared"); }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-main hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Recent Searches
          </button>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-main">Cache</p>
          <p className="mt-1 text-xs text-muted">
            Clears stored cached search results.
          </p>
          <button
            onClick={() => { clearCache(); notify("✅ Cache cleared"); }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-main hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Cache
          </button>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10">
          <p className="text-sm font-semibold text-main">Saved Results</p>
          <p className="mt-1 text-xs text-muted">Removes all bookmarked results.</p>
          <button
            onClick={() => { clearSaved(user?.id); notify("✅ Saved results cleared"); }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-main hover:bg-white/15 transition active:scale-95 text-sm"
          >
            Clear Saved Results
          </button>
        </div>

        <div className="glass rounded-3xl p-5 border border-red-400/15">
          <p className="text-sm font-semibold text-red-400">Reset App</p>
          <p className="mt-1 text-xs text-muted">
            Resets preferences, cache, saved results and history.
          </p>
          <button
            onClick={() => {
              const ok = confirm("Reset everything for your account?");
              if (!ok) return;
              resetAll(user?.id);
              notify("✅ App reset completed. Reloading…");
              window.location.reload();
            }}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-red-400/20 bg-red-500/10 text-red-400 hover:bg-red-500/15 transition active:scale-95 text-sm"
          >
            Reset Everything
          </button>
        </div>
      </div>

      <div className="mt-6 glass rounded-3xl p-5 border border-white/10">
        <p className="text-xs text-muted leading-relaxed">
          All preferences and saved items are stored locally in your browser, isolated by your account.
          Nothing is uploaded to any server.
        </p>
      </div>
    </div>
  );
}
