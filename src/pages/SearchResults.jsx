import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import SearchFilters from "../components/SearchFilters";

import ResultCard from "../components/ResultCard";
import ImageResultCard from "../components/ImageResultCard";
import NewsResultCard from "../components/NewsResultCard";
import ResultsSkeleton from "../components/ResultsSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import RecentChips from "../components/RecentChips";
import PreviewModal from "../components/PreviewModal";

// ✅ Day 16
import ResultDetailsModal from "../components/ResultDetailsModal";

import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
} from "../utils/storage";

import { searchImages } from "../services/imageSearchService";
import { searchWebCSE } from "../services/googleCseService";
import { searchNews } from "../services/newsService";

// ✅ Cache Utils
import { getCache, makeCacheKey, setCache } from "../utils/cache";

// ✅ Preferences
import { getPrefs, savePrefs } from "../utils/preferences";

const TRENDING_SEARCH = [
  "React hooks useEffect",
  "JavaScript promises",
  "Tailwind glassmorphism",
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

  const [isCached, setIsCached] = useState(false);

  // ✅ prefs state (persist)
  const [prefs, setPrefs] = useState(() => {
    return (
      getPrefs() || {
        region: "in",
        safe: true,
        perPage: 10,
      }
    );
  });

  const updatePrefs = (patch) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...patch };
      savePrefs(updated);
      return updated;
    });
  };

  // ✅ results
  const [webResults, setWebResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextWeb, setHasNextWeb] = useState(false);

  const [imageResults, setImageResults] = useState([]);
  const [imagePage, setImagePage] = useState(1);

  const [newsResults, setNewsResults] = useState([]);
  const [newsPage, setNewsPage] = useState(1);
  const [hasNextNews, setHasNextNews] = useState(false);

  const [meta, setMeta] = useState({
    totalResults: null,
    timeTaken: null,
  });

  // ✅ preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({ title: "", link: "" });

  const handlePreview = ({ title, link }) => {
    if (!link) return;
    setPreviewData({ title: title || "Preview", link });
    setPreviewOpen(true);
  };

  // ✅ Day 16 details modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const openDetails = (result) => {
    setDetailsData(result);
    setDetailsOpen(true);
  };

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // Reset pages when query changes
  useEffect(() => {
    if (!query.trim()) return;

    saveRecentSearch(query);
    setRecent(getRecentSearches());

    setPage(1);
    setImagePage(1);
    setNewsPage(1);
  }, [query]);

  // Reset pages when switching tab
  useEffect(() => {
    if (activeTab === "images") setImagePage(1);
    if (activeTab === "all") setPage(1);
    if (activeTab === "news") setNewsPage(1);
  }, [activeTab]);

  // Reset pages when filters change
  useEffect(() => {
    setPage(1);
    setImagePage(1);
    setNewsPage(1);
  }, [prefs.region, prefs.safe, prefs.perPage]);

  // helper for cache keys (query + prefs)
  const qWithPrefs = useMemo(() => {
    return `${query}|r=${prefs.region}|s=${prefs.safe ? 1 : 0}|n=${prefs.perPage}`;
  }, [query, prefs.region, prefs.safe, prefs.perPage]);

  // fetch logic
  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setError("");
      setIsCached(false);

      setWebResults([]);
      setImageResults([]);
      setNewsResults([]);

      try {
        const start = performance.now();

        // IMAGES
        if (activeTab === "images") {
          const cacheKey = makeCacheKey("images", qWithPrefs, imagePage);
          const cached = getCache(cacheKey);

          if (cached) {
            setImageResults(cached.imageResults || []);
            setMeta(cached.meta || { totalResults: null, timeTaken: null });
            setIsCached(true);
            setLoading(false);
            return;
          }

          const data = await searchImages(query, imagePage, prefs);
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

          const metaObj = {
            totalResults: null,
            timeTaken: ((performance.now() - start) / 1000).toFixed(2),
          };

          setImageResults(mappedImages);
          setMeta(metaObj);

          setCache(cacheKey, { imageResults: mappedImages, meta: metaObj }, 1000 * 60 * 30);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // NEWS
        if (activeTab === "news") {
          const cacheKey = makeCacheKey("news", qWithPrefs, newsPage);
          const cached = getCache(cacheKey);

          if (cached) {
            setNewsResults(cached.newsResults || []);
            setHasNextNews(!!cached.hasNextNews);
            setMeta(cached.meta || { totalResults: null, timeTaken: null });
            setIsCached(true);
            setLoading(false);
            return;
          }

          const data = await searchNews(query, newsPage, prefs);
          const articles = data?.articles || [];

          const mappedNews = articles
            .map((a) => ({
              title: a?.title || "No title",
              link: a?.url || "#",
              snippet: a?.description || "No description",
              image: a?.image || null,
              source: a?.source?.name || "Unknown Source",
              publishedAt: a?.publishedAt || null,
            }))
            .filter((x) => x.link && x.link !== "#");

          const hasNext = mappedNews.length === (prefs.perPage || 10);

          setNewsResults(mappedNews);
          setHasNextNews(hasNext);

          const metaObj = {
            totalResults: null,
            timeTaken: ((performance.now() - start) / 1000).toFixed(2),
          };

          setMeta(metaObj);

          setCache(
            cacheKey,
            { newsResults: mappedNews, meta: metaObj, hasNextNews: hasNext },
            1000 * 60 * 30
          );

          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // WEB (ALL)
        const cacheKey = makeCacheKey("web", qWithPrefs, page);
        const cached = getCache(cacheKey);

        if (cached) {
          setWebResults(cached.webResults || []);
          setMeta(cached.meta || { totalResults: null, timeTaken: null });
          setHasNextWeb(!!cached.hasNextWeb);
          setIsCached(true);
          setLoading(false);
          return;
        }

        const data = await searchWebCSE(query, page, prefs);
        const end = performance.now();

        const items = data?.items || [];
        const mappedWeb = items
          .map((item) => ({
            title: item?.title || "No title",
            link: item?.link || "#",
            snippet: item?.snippet || "No snippet available",
          }))
          .filter((x) => x.link && x.link !== "#");

        const hasNext = !!data?.queries?.nextPage?.length;

        const metaObj = {
          totalResults: data?.searchInformation?.formattedTotalResults || null,
          timeTaken: ((end - start) / 1000).toFixed(2),
        };

        setWebResults(mappedWeb);
        setHasNextWeb(hasNext);
        setMeta(metaObj);

        setCache(
          cacheKey,
          { webResults: mappedWeb, meta: metaObj, hasNextWeb: hasNext },
          1000 * 60 * 30
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.log("API ERROR:", err);
        setError(
          err?.response?.data?.error?.message ||
            err?.message ||
            "Failed to fetch search results."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query, activeTab, page, imagePage, newsPage, qWithPrefs, prefs]);

  const suggestions = useMemo(() => {
    return [...recent, ...TRENDING_SEARCH].slice(0, 20);
  }, [recent]);

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

          <SearchFilters
            region={prefs.region}
            safe={prefs.safe}
            perPage={prefs.perPage}
            onChange={updatePrefs}
          />

          <RecentChips
            items={recent}
            onSelect={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
            onClear={() => {
              clearRecentSearches();
              setRecent([]);
            }}
          />

          {query ? (
            <p className="text-sm text-white/60">
              {activeTab === "images" ? (
                <>
                  Image Page <span className="font-semibold text-white/80">{imagePage}</span>{" "}
                  for:{" "}
                </>
              ) : activeTab === "news" ? (
                <>
                  News Page <span className="font-semibold text-white/80">{newsPage}</span>{" "}
                  for:{" "}
                </>
              ) : (
                <>
                  Page <span className="font-semibold text-white/80">{page}</span>{" "}
                  for:{" "}
                </>
              )}
              <span className="text-blue-300 font-semibold">{query}</span>
              {isCached && (
                <span className="ml-2 text-[10px] px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/70">
                  cached
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-white/55">Enter a query to fetch results.</p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        {!query ? (
          <EmptyState title="Start searching" message="Type something to see results." />
        ) : loading ? (
          <ResultsSkeleton count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : activeTab === "images" ? (
          imageResults.length === 0 ? (
            <EmptyState title="No images found" message="Try another keyword." />
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {imageResults.map((img, idx) => (
                  <ImageResultCard key={idx} title={img.title} link={img.link} thumbnail={img.thumbnail} />
                ))}
              </div>

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
                  Page <span className="text-white/90 font-semibold">{imagePage}</span>
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
        ) : activeTab === "news" ? (
          newsResults.length === 0 ? (
            <EmptyState title="No news found" message="Try another keyword." />
          ) : (
            <>
              <div className="grid gap-4">
                {newsResults.map((r, idx) => (
                  <NewsResultCard
                    key={idx}
                    title={r.title}
                    link={r.link}
                    snippet={r.snippet}
                    image={r.image}
                    source={r.source}
                    publishedAt={r.publishedAt}
                  />
                ))}
              </div>

              <div className="mt-8 glass rounded-3xl p-5 flex items-center justify-between">
                <button
                  onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
                  disabled={newsPage === 1}
                  className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                    newsPage === 1
                      ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  ← Previous
                </button>

                <p className="text-sm text-white/60">
                  Page <span className="text-white/90 font-semibold">{newsPage}</span>
                </p>

                <button
                  onClick={() => setNewsPage((p) => p + 1)}
                  disabled={!hasNextNews}
                  className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                    !hasNextNews
                      ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
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
            <div className="grid gap-4">
              {webResults.map((r, idx) => (
                <ResultCard
                  key={idx}
                  title={r.title}
                  link={r.link}
                  snippet={r.snippet}
                  onPreview={handlePreview}
                  onDetails={openDetails} // ✅ Day 16
                />
              ))}
            </div>

            <div className="mt-8 glass rounded-3xl p-5 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextWeb}
                className={`px-5 py-2 rounded-xl border transition active:scale-95 ${
                  !hasNextWeb
                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url={previewData.link}
        title={previewData.title}
      />

      {/* ✅ Day 16 Details Modal */}
      <ResultDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        result={detailsData}
      />
    </div>
  );
}
