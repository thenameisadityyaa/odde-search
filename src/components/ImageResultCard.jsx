import { useState } from "react";
import { getDomain } from "../utils/format";

export default function ImageResultCard({ title, link, thumbnail }) {
  const domain = getDomain(link);
  const [broken, setBroken] = useState(false);

  const showImage = thumbnail && !broken;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
      title={title}
    >
      <div className="aspect-4/3 w-full bg-white/5 border-b border-white/10 overflow-hidden relative">
        {showImage ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-3xl">🖼️</div>
              <p className="mt-2 text-xs text-white/55">
                Image preview unavailable
              </p>
              <p className="mt-1 text-[11px] text-white/35">
                (Blocked by source site)
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        {!showImage && (
          <div className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/40 border border-white/10 text-white/70">
            preview blocked
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] text-white/55 truncate">{domain}</p>
        <h3 className="mt-1 text-sm font-semibold text-white/85 line-clamp-2 group-hover:text-white">
          {title}
        </h3>
      </div>
    </a>
  );
}
