import { useEffect, useMemo, useState } from "react";

function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default function ResultDetailsModal({ open, onClose, result }) {
  const [copied, setCopied] = useState(false);

  const domain = useMemo(() => getDomain(result?.link), [result?.link]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
  }, [open]);

  if (!open || !result?.link) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.log("Copy failed:", e);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: result.title || "Odde Search Result",
          text: result.snippet || "",
          url: result.link,
        });
      } else {
        await copyLink();
      }
    } catch {
      // user cancelled share -> ignore
    }
  };

  return (
    <div className="fixed inset-0 z-9999">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl glass rounded-3xl overflow-hidden border border-white/12 shadow-2xl">
          {/* Top */}
          <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-white/55 truncate">
                {domain || "Website"}
              </p>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-white/90 leading-snug line-clamp-2">
                {result.title || "Result Details"}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15 transition active:scale-95 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-sm text-white/70 leading-relaxed">
              {result.snippet || "No snippet available."}
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-[11px] text-white/50">Link</p>
              <p className="mt-1 text-xs text-white/80 break-all">
                {result.link}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={result.link}
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

              <button
                onClick={share}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
              >
                📤 Share
              </button>
            </div>

            <p className="mt-4 text-[11px] text-white/45">
              Tip: Many sites block iframe preview — Open works always.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
