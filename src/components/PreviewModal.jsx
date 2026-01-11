import { useEffect } from "react";

export default function PreviewModal({ open, onClose, url, title }) {
  // ESC close support
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-5xl glass rounded-3xl overflow-hidden border border-white/12 shadow-2xl">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>

              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate">
                  {title || "Preview"}
                </p>
                <p className="text-[11px] text-white/55 truncate">{url}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15 transition active:scale-95 text-xs"
              >
                Open in new tab ↗
              </a>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15 transition active:scale-95 text-xs"
              >
                Close ✕
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="h-[70vh] bg-black/30">
            {/* Many sites block iframe. If blocked user can open in new tab */}
            <iframe
              title="Preview"
              src={url}
              className="w-full h-full"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            />
          </div>

          {/* Footer note */}
          <div className="px-4 sm:px-6 py-3 text-[11px] text-white/45 border-t border-white/10 bg-white/5">
            Note: Some websites block preview inside apps. If preview is blank,
            use <span className="text-white/70 font-semibold">Open in new tab</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
