import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeDown">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-red-400" />
      </div>
      <h3 className="text-2xl font-bold text-main">Something went wrong</h3>
      <p className="mt-3 text-muted max-w-sm mb-8 leading-relaxed">
        {message || "An error occurred while fetching results. Please try again later."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 text-main font-semibold hover:bg-white/15 transition-all active:scale-95"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
}
