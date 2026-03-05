import { useSearchParams } from "react-router-dom";
import useSearchQuery from "../hooks/useSearchQuery";
import { getPrefs } from "../utils/preferences";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import ResultCard from "../components/ResultCard";
import ImageResultCard from "../components/ImageResultCard";
import NewsResultCard from "../components/NewsResultCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PreviewModal from "../components/PreviewModal";
import ResultDetailsModal from "../components/ResultDetailsModal";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Filter, SlidersHorizontal } from "lucide-react";
import { saveItem, isSaved } from "../utils/saved";
import { useAuth } from "../context/AuthContext";

export default function SearchResults() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const tab = searchParams.get("tab") || "web";
  const page = parseInt(searchParams.get("page") || "1");

  const [preview, setPreview] = useState(null);
  const [details, setDetails] = useState(null);

  const { data, isLoading, isError, error, isFetching } = useSearchQuery(
    query,
    tab,
    page,
    getPrefs(user?.id),
    user?.id
  );

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, tab, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (result) => {
    saveItem(result, user?.id);
  };

  if (!query) return <EmptyState query="" />;

  return (
    <div className="min-h-screen pb-32 bg-liquid">
      {/* Search Header */}
      <div className="sticky top-[var(--nav-height)] z-40 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-premium rounded-3xl p-4 border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <SearchBar size="md" defaultValue={query} />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-main hover:bg-white/10 transition-all">
                  <Filter size={18} />
                </button>
                <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-main hover:bg-white/10 transition-all">
                  <SlidersHorizontal size={18} />
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <SearchTabs activeTab={tab} onTabChange={(t) => setSearchParams({ q: query, tab: t, page: 1 })} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Info */}
        {!isLoading && data?.meta && (
          <div className="mb-10 animate-reveal">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
              Found {(typeof data.meta.totalResults === 'string' ? parseInt(data.meta.totalResults.replace(/,/g, '')) : data.meta.totalResults).toLocaleString()} results in {data.meta.timeTaken}s
            </p>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex flex-col items-center justify-center py-32 animate-reveal">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-main font-black tracking-widest uppercase text-xs">Processing Query...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="animate-reveal">
            <ErrorState
              message={error?.message || "Something went wrong"}
              onRetry={() => refetch()}
            />
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !isError && data?.results?.length === 0 && (
          <div className="animate-reveal">
            <EmptyState query={query} />
          </div>
        )}

        {!isLoading && !isError && data?.results?.length > 0 && (
          <div className="animate-reveal">
            {tab === "web" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.results.map((res, i) => (
                  <ResultCard
                    key={i}
                    result={res}
                    onSave={handleSave}
                    isSaved={isSaved(res.link, user?.id)}
                  />
                ))}
              </div>
            )}

            {tab === "image" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.results.map((res, i) => (
                  <ImageResultCard
                    key={i}
                    result={res}
                    onPreview={(img) => setPreview(img)}
                  />
                ))}
              </div>
            )}

            {tab === "news" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.results.map((res, i) => (
                  <NewsResultCard key={i} result={res} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-24 flex items-center justify-center gap-6">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-4 rounded-[1.5rem] glass-premium border border-white/10 text-main disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-3">
                {[...Array(Math.min(5, Math.ceil((data?.totalResults || 0) / 10)))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${page === p
                        ? "bg-blue-500 text-white shadow-xl shadow-blue-500/30 scale-110"
                        : "glass border border-white/10 text-muted hover:bg-white/10"
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                className="p-4 rounded-[1.5rem] glass-premium border border-white/10 text-main hover:bg-white/10 transition-all active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <PreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        url={preview?.link}
        title={preview?.title}
      />

      <ResultDetailsModal
        open={!!details}
        onClose={() => setDetails(null)}
        result={details}
      />
    </div>
  );
}
