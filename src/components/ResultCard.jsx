import { ExternalLink, Share2, Bookmark, Globe } from "lucide-react";

export default function ResultCard({ result, onSave, isSaved }) {
  const { title, link, displayLink, snippet } = result;

  return (
    <div className="group glass-premium rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-500 border border-white/5 hover:border-blue-500/30 animate-reveal">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-[10px] font-black text-muted uppercase tracking-[0.2em] truncate max-w-[70%]">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors duration-500">
            <img
              src={`https://www.google.com/s2/favicons?domain=${new URL(link).hostname}&sz=64`}
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = '<div class="text-blue-400"><Globe size={14} /></div>';
              }}
            />
          </div>
          <span className="truncate opacity-70 group-hover:opacity-100 transition-opacity duration-500">
            {displayLink || new URL(link).hostname}
          </span>
          {result.isMock && (
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black">
              TOP RESULT
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => onSave?.(result)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isSaved
              ? "text-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/10"
              : "text-muted hover:text-main hover:bg-white/10"
              }`}
            title={isSaved ? "Saved" : "Save"}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button className="p-2.5 rounded-xl text-muted hover:text-main hover:bg-white/10 transition-all duration-300">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="block group/title"
      >
        <h3 className="text-xl font-bold text-main group-hover/title:text-blue-400 transition-all duration-300 line-clamp-2 leading-tight mb-4">
          {title}
        </h3>
      </a>

      <p className="text-sm text-muted font-medium line-clamp-3 leading-relaxed opacity-70 group-hover:opacity-90 transition-opacity duration-500">
        {snippet}
      </p>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-blue-500/60 uppercase tracking-widest group-hover:text-blue-400 transition-colors duration-500">
          <span>View full page</span>
          <ExternalLink size={12} />
        </div>
        <div className="text-[10px] font-black text-muted uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity duration-500">
          Source: {new URL(link).hostname}
        </div>
      </div>
    </div>
  );
}
