import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  size = "lg",
  defaultValue = "",
  onSearch,
}) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // allow parent control
    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const width =
    size === "lg"
      ? "max-w-2xl"
      : size === "md"
      ? "max-w-xl"
      : "max-w-lg";

  return (
    <form onSubmit={handleSearch} className={`w-full ${width} mx-auto`}>
      <div className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
        <svg className="h-5 w-5 text-white/60" viewBox="0 0 24 24" fill="none">
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          className="w-full bg-transparent outline-none text-white placeholder:text-white/45 text-base"
        />

        <button
          type="submit"
          className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white font-medium hover:bg-white/15 active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
}
