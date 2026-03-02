import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { saveRecentSearch } from "../utils/storage";

export default function SearchBar({
  size = "lg",
  defaultValue = "",
  onSearch,
  suggestions = [],
  onDropdownChange,
}) {
  const { user } = useAuth();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (onDropdownChange) onDropdownChange(open);
  }, [open, onDropdownChange]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const width =
    size === "lg"
      ? "max-w-2xl"
      : size === "md"
        ? "max-w-xl"
        : "max-w-lg";

  const safeSuggestions = useMemo(() => {
    return (suggestions || [])
      .map((s) => {
        if (typeof s === "string") return s;
        if (s && typeof s === "object") return s.keyword || s.text || s.value;
        return String(s);
      })
      .filter(Boolean)
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return safeSuggestions.slice(0, 6);
    return safeSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, safeSuggestions]);

  const doSearch = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return;

    setOpen(false);
    setActiveIndex(-1);

    // Profile-aware history
    saveRecentSearch(trimmed, user?.id);

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!filteredSuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => (p + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => (p <= 0 ? filteredSuggestions.length - 1 : p - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      doSearch(filteredSuggestions[activeIndex]);
    }
  };

  return (
    <div ref={wrapRef} className={`w-full ${width} mx-auto relative z-30`}>
      <form onSubmit={handleSubmit}>
        <div className="glass-soft flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl border border-white/10 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <Search size={20} className="text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web..."
            className="w-full bg-transparent outline-none text-main placeholder:text-muted text-base sm:text-lg"
            autoComplete="off"
          />
          <button
            type="submit"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Search
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {open && filteredSuggestions.length > 0 && (
        <div className="absolute mt-3 w-full glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-50">
          <div className="px-4 py-2 text-xs text-muted">Suggestions</div>
          <div className="max-h-72 overflow-auto">
            {filteredSuggestions.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item + idx}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => doSearch(item)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${active ? "bg-white/10 text-main" : "text-muted hover:bg-white/10 hover:text-main"
                    }`}
                >
                  <span className="text-muted">🔎</span>
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 text-[11px] text-muted border-t border-white/10">
            Use ↑ ↓ to navigate • Enter to select • Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
