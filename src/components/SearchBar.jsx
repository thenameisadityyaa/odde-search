import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  size = "lg",
  defaultValue = "",
  onSearch,
  suggestions = [],
  onDropdownChange, // ✅ NEW: tells parent when dropdown opens/closes
}) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  // Tell parent dropdown state
  useEffect(() => {
    if (onDropdownChange) onDropdownChange(open);
  }, [open, onDropdownChange]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
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

  // Filter suggestions based on query
  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 6);

    return suggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, suggestions]);

  const doSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setOpen(false);
    setActiveIndex(-1);

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
      setActiveIndex((p) =>
        p <= 0 ? filteredSuggestions.length - 1 : p - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      doSearch(filteredSuggestions[activeIndex]);
    }
  };

  return (
    <div ref={wrapRef} className={`w-full ${width} mx-auto relative z-30`}>
      <form onSubmit={handleSubmit}>
        <div className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
          {/* icon */}
          <svg
            className="h-5 w-5 text-white/60"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

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
            className="w-full bg-transparent outline-none text-white placeholder:text-white/45 text-base"
            autoComplete="off"
          />

          <button
            type="submit"
            className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white font-medium hover:bg-white/15 active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && filteredSuggestions.length > 0 && (
        <div className="absolute mt-3 w-full glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-50">
          <div className="px-4 py-2 text-xs text-white/50">Suggestions</div>

          <div className="max-h-72 overflow-auto">
            {filteredSuggestions.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item + idx}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => doSearch(item)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-white/50">🔎</span>
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 text-[11px] text-white/45 border-t border-white/10">
            Use ↑ ↓ to navigate • Enter to select • Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
