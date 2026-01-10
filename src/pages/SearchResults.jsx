import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import ResultCard from "../components/ResultCard";
import ResultsSkeleton from "../components/ResultsSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import RecentChips from "../components/RecentChips";
import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
} from "../utils/storage";

const TRENDING_SEARCH = [
  "React hooks useEffect",
  "JavaScript promises",
  "Tailwind glassmorphism",
  "RapidAPI google search",
  "Vite React deployment",
  "Debounce search input",
];

const MOCK_ALL_RESULTS = [
  {
    title: "React – Official Documentation",
    link: "https://react.dev",
    snippet:
      "React is a JavaScript library for building user interfaces. Learn how to build components, manage state, and create modern web apps.",
  },
  {
    title: "RapidAPI – Google Search API",
    link: "https://rapidapi.com",
    snippet:
      "RapidAPI provides access to third-party APIs including Google Search. Integrate APIs quickly and test endpoints efficiently.",
  },
  {
    title: "Tailwind CSS v4 – Utility-First Styling",
    link: "https://tailwindcss.com",
    snippet:
      "Tailwind CSS helps you build modern websites faster with utility classes and a clean design system approach.",
  },
];

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";

  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  const results = useMemo(() => {
    return MOCK_ALL_RESULTS;
  }, []);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    saveRecentSearch(query);
    setRecent(getRecentSearches());
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      if (query.toLowerCase().includes("error")) {
        setError("Simulation: Something went wrong. Please try again.");
      }
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const handleSearchFromBar = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Search</h1>

          <SearchBar
            size="md"
            defaultValue={query}
            suggestions={[...recent, ...TRENDING_SEARCH]}
            onSearch={handleSearchFromBar}
          />

          <SearchTabs active={activeTab} onChange={setActiveTab} />

          <RecentChips
            items={recent}
            onSelect={(value) =>
              navigate(`/search?q=${encodeURIComponent(value)}`)
            }
            onClear={() => {
              clearRecentSearches();
              setRecent([]);
            }}
          />

          {query ? (
            <p className="text-sm text-white/60">
              Showing{" "}
              <span className="font-semibold text-white/80">
                {activeTab.toUpperCase()}
              </span>{" "}
              results for:{" "}
              <span className="text-blue-300 font-semibold">{query}</span>
            </p>
          ) : (
            <p className="text-sm text-white/55">
              Enter a query to fetch results.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        {!query ? (
          <EmptyState
            title="Start searching"
            message="Type something in the search bar to see results."
          />
        ) : loading ? (
          <ResultsSkeleton count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid gap-4">
            {results.map((r, idx) => (
              <ResultCard
                key={idx}
                title={r.title}
                link={r.link}
                snippet={r.snippet}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
