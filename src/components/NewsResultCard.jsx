import { Newspaper, Clock, ExternalLink } from "lucide-react";

export default function NewsResultCard({ result }) {
  const { title, link, snippet, source, publishedAt } = result;

  return (
    <div className="group glass rounded-3xl p-6 hover:shadow-2xl transition-all border border-white/5 hover:border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Newspaper size={16} className="text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest truncate">
            {source}
          </p>
          {publishedAt && (
            <p className="text-[10px] text-muted flex items-center gap-1">
              <Clock size={10} />
              {new Date(publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="block group/title"
      >
        <h3 className="text-lg font-bold text-main group-hover/title:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
      </a>

      <p className="mt-3 text-sm text-muted line-clamp-3 leading-relaxed">
        {snippet}
      </p>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-blue-400/60 font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
        <span>Read full article</span>
        <ExternalLink size={10} />
      </div>
    </div>
  );
}
