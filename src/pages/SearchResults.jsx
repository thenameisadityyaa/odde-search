import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import ResultCard from "../components/ResultCard";
import ImageResultCard from "../components/ImageResultCard";
import NewsResultCard from "../components/NewsResultCard";
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
import { searchImages } from "../services/imageSearchService";

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

  // ✅ web results
  const [webResults, setWebResults] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [knowledgePanel, setKnowledgePanel] = useState(null);

  // ✅ image results
  const [imageResults, setImageResults] = useState([]);

  // ✅ Image pagination
  const [imagePage, setImagePage] = useState(1);

  // ✅ Pagination (web only)
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [page, setPage] = useState(1);

  // ✅ meta
  const [meta, setMeta] = useState({
    totalResults: null,
    timeTaken: null,
  });

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // ✅ save query to recent + reset pagination
  useEffect(() => {
    if (!query.trim()) return;

    saveRecentSearch(query);
    setRecent(getRecentSearches());

    // reset web pagination
    setCursor(null);
    setNextCursor(null);
    setCursorHistory([]);
    setPage(1);

    // ✅ reset image pagination
    setImagePage(1);
  }, [query]);

  // ✅ Reset pages on tab switch (optional but clean UX)
  useEffect(() => {
    if (activeTab === "images") {
      setImagePage(1);
    } else {
      setCursor(null);
      setNextCursor(null);
      setCursorHistory([]);
      setPage(1);
    }
  }, [activeTab]);

  // ✅ Fetch data based on activeTab
  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setError("");

      // reset current view
      setWebResults([]);
      setImageResults([]);
      setRelatedKeywords([]);
      setKnowledgePanel(null);

      try {
        const start = performance.now();

        // ✅ If IMAGES tab → use Image API (with imagePage)
        if (activeTab === "images") {
          const data = await searchImages(query, imagePage);

          /**
           * Real-Time Image Search returns usually under:
           * data.data
           */
          const items =
            data?.data || data?.results || data?.images || data?.items || [];

          const mappedImages = items
            .map((img) => ({
              title: img?.title || img?.name || "Image",
              thumbnail:
                img?.thumbnail_url ||
                img?.thumbnail ||
                img?.image ||
                img?.url ||
                null,
              link:
                img?.source_url ||
                img?.source ||
                img?.link ||
                img?.url ||
                "#",
            }))
            .filter((x) => x.link && x.link !== "#");

          setImageResults(mappedImages);

          setMeta({
            totalResults: null,
            timeTaken: ((performance.now() - start) / 1000).toFixed(2),
          });

          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // ✅ ALL / NEWS → use Web API (cursor pagination)
        const data = await searchGoogle(query, cursor);
        const end = performance.now();

        const items = data?.results || [];
        const mappedWeb = items
          .map((item) => ({
            title: item?.title || "No title",
            link: item?.url || "#",
            snippet: item?.description || "No snippet available",
          }))
          .filter((x) => x.link && x.link !== "#");

        setWebResults(mappedWeb);
        setNextCursor(data?.next_cursor || null);

        setMeta({
          totalResults: data?.total_results || null,
          timeTaken: ((end - start) / 1000).toFixed(2),
        });

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
        setKnowledgePanel(data?.knowledge_panel || null);

        window.scrollTo({ top: 0, behavior: "smooth" });
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
  }, [query, cursor, activeTab, imagePage]);

  const suggestions = useMemo(() => {
    const related = relatedKeywords.slice(0, 6);
    return [...recent, ...related, ...TRENDING_SEARCH].slice(0, 20);
  }, [recent, relatedKeywords]);

  const handleSearchFromBar = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  // ✅ Pagination handlers (web only)
  const handleNext = () => {
    if (!nextCursor) return;
    setCursorHistory((prev) => [...prev, cursor]);
    setCursor(nextCursor);
    setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page <= 1) return;

    setCursorHistory((prev) => {
      const updated = [...prev];
      const lastCursor = updated.pop();
      setCursor(lastCursor || null);
      return updated;
    });

    setPage((p) => Math.max(1, p - 1));
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
              {activeTab === "images" ? (
                <>
                  Image Page{" "}
                  <span className="font-semibold text-white/80">
                    {imagePage}
                  </span>{" "}
                  for:{" "}
                </>
              ) : (
                <>
                  Page{" "}
                  <span className="font-semibold text-white/80">{page}</span>{" "}
                  for:{" "}
                </>
              )}
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
            message="Type something to see results."
          />
        ) : loading ? (
          <ResultsSkeleton count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : activeTab === "images" ? (
          imageResults.length === 0 ? (
            <EmptyState title="No images found" message="Try another keyword." />
          ) : (
            <>
              {/* meta */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
                <p>
                  Showing {imageResults.length} images{" "}
                  {meta.timeTaken ? `(${meta.timeTaken} seconds)` : ""}
                </p>
                <p className="hidden sm:block">Powered by RapidAPI</p>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {imageResults.map((img, idx) => (
                  <ImageResultCard
                    key={idx}
                    title={img.title}
                    link={img.link}
                    thumbnail={img.thumbnail}
                  />
                ))}
              </div>

              {/* ✅ Images Pagination */}
              <div className="mt-8 glass rounded-3xl p-5 flex items-center justify-between">
                <button
                  onClick={() => setImagePage((p) => Math.max(1, p - 1))}
                  disabled={imagePage === 1}
                  className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                    imagePage === 1
                      ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  ← Previous
                </button>

                <p className="text-sm text-white/60">
                  Page{" "}
                  <span className="text-white/90 font-semibold">
                    {imagePage}
                  </span>
                </p>

                <button
                  onClick={() => setImagePage((p) => p + 1)}
                  className="px-5 py-2 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/15 transition active:scale-95"
                >
                  Next →
                </button>
              </div>
            </>
          )
        ) : webResults.length === 0 ? (
          <EmptyState title="No results found" message="Try another keyword." />
        ) : (
          <>
            {/* meta */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
              <p>
                {meta.totalResults
                  ? `About ${meta.totalResults} results`
                  : `Showing ${webResults.length} results`}{" "}
                {meta.timeTaken ? `(${meta.timeTaken} seconds)` : ""}
              </p>
              <p className="hidden sm:block">Powered by RapidAPI</p>
            </div>

            {/* knowledge panel only in ALL */}
            {activeTab === "all" && knowledgePanel?.name && (
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

            {/* tab rendering */}
            {activeTab === "all" && (
              <div className="grid gap-4">
                {webResults.map((r, idx) => (
                  <ResultCard
                    key={idx}
                    title={r.title}
                    link={r.link}
                    snippet={r.snippet}
                  />
                ))}
              </div>
            )}

            {activeTab === "news" && (
              <div className="grid gap-4">
                {webResults.map((r, idx) => (
                  <NewsResultCard
                    key={idx}
                    title={r.title}
                    link={r.link}
                    snippet={r.snippet}
                  />
                ))}
              </div>
            )}

            {/* pagination web only */}
            <div className="mt-8 glass rounded-3xl p-5 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                  page === 1
                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                ← Previous
              </button>

              <p className="text-sm text-white/60">
                Page <span className="text-white/90 font-semibold">{page}</span>
              </p>

              <button
                onClick={handleNext}
                disabled={!nextCursor}
                className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                  !nextCursor
                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Next →
              </button>
            </div>

            {/* related searches */}
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
