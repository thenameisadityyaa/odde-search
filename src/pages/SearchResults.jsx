import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Search Results
          </h1>

          <SearchBar size="md" />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/80">
              You searched for:{" "}
              <span className="font-semibold text-blue-400">
                {query || "Nothing"}
              </span>
            </p>
            <p className="mt-2 text-sm text-white/50">
              API integration will be added soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
