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
        <div
          className="search-container flex items-center gap-3 px-4 py-3"
          style={{ paddingLeft: "1rem", paddingRight: "0.75rem" }}
        >
          <Search size={18} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "0.95rem",
              fontFamily: "Inter, sans-serif",
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn-accent hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm"
            style={{ flexShrink: 0 }}
          >
            Search
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {open && filteredSuggestions.length > 0 && (
        <div
          className="animate-reveal"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        >
          <div style={{ padding: "6px 12px 4px", fontSize: 10, fontFamily: "Manrope", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Suggestions</div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {filteredSuggestions.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={item + idx}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => doSearch(item)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    fontSize: "0.85rem",
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: active ? "var(--text-main)" : "var(--text-muted)",
                    background: active ? "var(--surface-2)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Search size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item}</span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "5px 12px 7px", fontSize: "10px", color: "var(--text-faint)", borderTop: "1px solid var(--border)", fontFamily: "Inter" }}>
            ↑ ↓ navigate · Enter select · Esc close
          </div>
        </div>
      )}
    </div>
  );
}
