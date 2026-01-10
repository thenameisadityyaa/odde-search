import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import ResultsSkeleton from "../components/ResultsSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const MOCK_RESULTS = [
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
  const query = params.get("q");

  // simulate API lifecycle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError("");
    setResults([]);

    // simulate network delay (premium feel)
    const timer = setTimeout(() => {
      // if query has "error" show error
      if (query.toLowerCase().includes("error")) {
        setError("API failure simulation: please try again.");
        setLoading(false);
        return;
      }

      setResults(MOCK_RESULTS);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Area */}
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Search Results
          </h1>

          <SearchBar size="md" />

          {query && (
            <p className="text-sm text-white/60">
              Showing results for:{" "}
              <span className="text-blue-300 font-semibold">{query}</span>
            </p>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="mt-6">
        {!query ? (
          <EmptyState
            title="Start searching"
            message="Enter something in the search bar to see results."
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
