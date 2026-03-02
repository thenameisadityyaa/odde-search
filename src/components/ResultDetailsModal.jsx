import { useEffect, useMemo, useState } from "react";
import { X, Copy, Share2, ExternalLink, Globe, Check } from "lucide-react";

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

  // Reset copied state when modal closes
  if (!open && copied) {
    setCopied(false);
  }

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


  if (!open || !result?.link) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-zoomIn">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Globe size={24} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                {domain || "Website"}
              </p>
              <h2 className="text-xl font-bold text-main leading-tight line-clamp-2">
                {result.title || "Result Details"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-main transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-base text-muted leading-relaxed mb-8">
            {result.snippet || "No description available for this result."}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-8">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">
              Direct Link
            </p>
            <p className="text-sm text-blue-400 break-all font-medium">
              {result.link}
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={result.link}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <ExternalLink size={20} />
              <span className="text-[10px] font-bold uppercase">Open</span>
            </a>

            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-main hover:bg-white/10 transition-all active:scale-95"
            >
              {copied ? (
                <Check size={20} className="text-emerald-400" />
              ) : (
                <Copy size={20} />
              )}
              <span className="text-[10px] font-bold uppercase">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>

            <button
              onClick={share}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-main hover:bg-white/10 transition-all active:scale-95"
            >
              <Share2 size={20} />
              <span className="text-[10px] font-bold uppercase">Share</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-8 py-4 bg-white/5 border-t border-white/10">
          <p className="text-[10px] text-muted text-center italic">
            Tip: Use "Open" if the site blocks embedded previews.
          </p>
        </div>
      </div>
    </div>
  );
}
