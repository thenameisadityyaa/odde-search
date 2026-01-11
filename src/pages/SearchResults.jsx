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

import { searchGoogle } from "../services/searchService";

const TRENDING_SEARCH = [
  "React hooks useEffect",
  "JavaScript promises",
  "Tailwind glassmorphism",
  "RapidAPI google search",
  "Vite React deployment",
  "Debounce search input",
];

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";

  const [activeTab, setActiveTab] = useState("all");

  const [recent, setRecent] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [results, setResults] = useState([]);

  // extra data
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [knowledgePanel, setKnowledgePanel] = useState(null);

  // load recent searches
  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // save query to recent
  useEffect(() => {
    if (!query.trim()) return;
    saveRecentSearch(query);
    setRecent(getRecentSearches());
  }, [query]);

  // ✅ Fetch real API results
  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setError("");
      setResults([]);
      setRelatedKeywords([]);
      setKnowledgePanel(null);

      try {
        const data = await searchGoogle(query);

        // ✅ results mapping
        const items = data?.results || [];
        const mapped = items
          .map((item) => ({
            title: item?.title || "No title",
            link: item?.url || "#",
            snippet: item?.description || "No snippet available",
          }))
          .filter((x) => x.link && x.link !== "#");

        setResults(mapped);

        // ✅ related keywords mapping (IMPORTANT FIX)
        // API returns objects: { keyword, keyword_html, ... }
        const rawKeywords = data?.related_keywords?.keywords || [];
        const cleanedKeywords = rawKeywords
          .map((k) => {
            if (typeof k === "string") return k;
            if (k && typeof k === "object" && typeof k.keyword === "string")
              return k.keyword;
            return null;
          })
          .filter(Boolean);

        setRelatedKeywords(cleanedKeywords);

        // knowledge panel
        setKnowledgePanel(data?.knowledge_panel || null);
      } catch (err) {
        console.log("API ERROR:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch search results."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query, activeTab]);

  const suggestions = useMemo(() => {
    const related = relatedKeywords.slice(0, 6);
    return [...recent, ...related, ...TRENDING_SEARCH].slice(0, 20);
  }, [recent, relatedKeywords]);

  const handleSearchFromBar = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Search</h1>

          <SearchBar
            size="md"
            defaultValue={query}
            suggestions={suggestions}
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

      {/* Results */}
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
            {/* Knowledge Panel */}
            {knowledgePanel?.name && (
              <div className="glass rounded-3xl p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {knowledgePanel?.image?.url && (
                    <img
                      src={knowledgePanel.image.url}
                      alt={knowledgePanel.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                    />
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {knowledgePanel.name}
                    </h2>

                    {knowledgePanel?.label && (
                      <p className="text-sm text-white/60 mt-1">
                        {knowledgePanel.label}
                      </p>
                    )}

                    {knowledgePanel?.description?.text && (
                      <p className="text-sm text-white/70 mt-3 leading-relaxed">
                        {knowledgePanel.description.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Result Count */}
            <div className="mb-4 flex items-center justify-between text-xs text-white/50">
              <p>Showing {results.length} results</p>
              <p className="hidden sm:block">Powered by RapidAPI</p>
            </div>

            {/* Cards */}
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

            {/* Related searches chips */}
            {relatedKeywords.length > 0 && (
              <div className="mt-8 glass rounded-3xl p-5">
                <p className="text-sm font-semibold text-white/80">
                  Related searches
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedKeywords.slice(0, 10).map((k, idx) => (
                    <button
                      key={k + idx}
                      onClick={() =>
                        navigate(`/search?q=${encodeURIComponent(k)}`)
                      }
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10 active:scale-95"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
