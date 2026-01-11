import { useMemo, useState } from "react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function NewsResultCard({
  title,
  link,
  snippet,
  image,
  source,
  publishedAt,
}) {
  const [copied, setCopied] = useState(false);

  const published = useMemo(() => timeAgo(publishedAt), [publishedAt]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.log("Copy failed:", e);
    }
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40">
              no image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-white/55">
            {source || "News"} {published ? `• ${published}` : ""}
          </p>

          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-base sm:text-lg font-bold text-white/90 hover:text-white transition line-clamp-2"
          >
            {title}
          </a>

          <p className="mt-1 text-sm text-white/65 leading-relaxed line-clamp-2">
            {snippet}
          </p>

          {/* actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
            >
              ↗ Open
            </a>

            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
            >
              {copied ? "✅ Copied" : "🔗 Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
