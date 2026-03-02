import { X, ExternalLink, Maximize2 } from "lucide-react";

export default function PreviewModal({ open, onClose, url, title }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl aspect-video glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-zoomIn flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Maximize2 size={16} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-main truncate">
                {title || "Preview"}
              </h3>
              <p className="text-[10px] text-muted truncate">{url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Open Site
              <ExternalLink size={12} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-main transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
