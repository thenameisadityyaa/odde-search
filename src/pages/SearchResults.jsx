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
  {
    title: "Vite – Next Generation Frontend Tooling",
    link: "https://vitejs.dev",
    snippet:
      "Vite is a modern frontend build tool that provides faster development experience for React and other frameworks.",
  },
];

const MOCK_IMAGES_RESULTS = [
  {
    title: "Glass UI Inspiration",
    link: "https://dribbble.com/tags/glassmorphism",
    snippet:
      "Explore glassmorphism UI concepts and premium Apple-like interface inspirations.",
  },
  {
    title: "Modern UI Gallery",
    link: "https://www.behance.net",
    snippet:
      "Browse modern UI design samples that inspire premium web layouts.",
  },
];

const MOCK_NEWS_RESULTS = [
  {
    title: "Frontend Trends 2026",
    link: "https://developer.mozilla.org/",
    snippet:
      "Discover how modern frontend apps use APIs, caching, and modular UI systems to create smooth experiences.",
  },
  {
    title: "React Ecosystem Updates",
    link: "https://react.dev/blog",
    snippet:
      "Latest updates from the React ecosystem, best practices, and new improvements.",
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

  // results for current tab
  const results = useMemo(() => {
    if (activeTab === "images") return MOCK_IMAGES_RESULTS;
    if (activeTab === "news") return MOCK_NEWS_RESULTS;
    return MOCK_ALL_RESULTS;
  }, [activeTab]);

  // Load recent searches initially
  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // Save query to recent searches when query changes
  useEffect(() => {
    if (!query.trim()) return;

    saveRecentSearch(query);
    setRecent(getRecentSearches()); // refresh UI
  }, [query]);

  // Simulate loading state when query or tab changes
  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      // If query has "error" show error (demo)
      if (query.toLowerCase().includes("error")) {
        setError("Simulation: Something went wrong. Please try again.");
      }

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleSearchFromBar = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleChipSelect = (value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecent([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Area */}
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Search</h1>

          {/* Search bar */}
          <SearchBar
            size="md"
            defaultValue={query}
            onSearch={handleSearchFromBar}
          />

          {/* Tabs */}
          <SearchTabs active={activeTab} onChange={handleTabChange} />

          {/* Recent Search Chips */}
          <RecentChips
            items={recent}
            onSelect={handleChipSelect}
            onClear={handleClearRecent}
          />

          {/* Query info */}
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

      {/* Results Area */}
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
        ) : results.length === 0 ? (
          <EmptyState
            title="No results found"
            message="Try searching with different keywords."
          />
        ) : (
          <>
            {/* small info bar */}
            <div className="mb-4 flex items-center justify-between text-xs text-white/50">
              <p>Showing {results.length} results (mock mode)</p>
              <p className="hidden sm:block">API integration starts Day 5 ✅</p>
            </div>

            {/* results list */}
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

            {/* Placeholder: pagination/footer future */}
            <div className="mt-6 glass rounded-2xl px-4 py-3 text-sm text-white/60 text-center">
              Pagination will be added after API integration.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
