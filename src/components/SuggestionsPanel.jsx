import { Search, TrendingUp, History, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecentSearches, clearRecentSearches } from "../utils/storage";

export default function SuggestionsPanel({
  isVisible,
  onSelect,
  trending = [],
}) {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);

  // Reload recent searches from localStorage whenever panel becomes visible
  useEffect(() => {
    if (isVisible && user?.id) {
      setRecent(getRecentSearches(user.id)); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [isVisible, user?.id]);

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (user?.id) {
      clearRecentSearches(user.id);
      setRecent([]);
    }
  };

  const hasRecent = recent.length > 0; // Updated to use the recent state

  return (
    <div className="glass rounded-3xl p-6 mt-8 animate-fadeDown">
      {/* Recent Searches */}
      {hasRecent && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
              <History size={14} />
              Recent Searches
            </h3>
            <button
              onClick={handleClearAll}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-main hover:bg-white/10 transition-all"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest mb-4">
          <TrendingUp size={14} />
          Trending Now
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trending.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-left text-sm text-main hover:bg-white/10 hover:border-white/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Search size={14} className="text-blue-400" />
              </div>
              <span className="font-medium truncate">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
