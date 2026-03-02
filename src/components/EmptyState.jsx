import { Search } from "lucide-react";

export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeDown">
      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
        <Search size={32} className="text-muted" />
      </div>
      <h3 className="text-2xl font-bold text-main">No results found</h3>
      <p className="mt-3 text-muted max-w-sm leading-relaxed">
        We couldn't find anything for <span className="text-blue-400 font-semibold">"{query}"</span>.
        Try different keywords or check your spelling.
      </p>
    </div>
  );
}
