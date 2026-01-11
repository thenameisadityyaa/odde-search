import { useState } from "react";
import { getDomain } from "../utils/format";

export default function ResultCard({ title, link, snippet, onPreview }) {
  const domain = getDomain(link);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.log("Clipboard copy failed:", e);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] text-white/55">{domain}</p>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-lg font-bold text-white/90 hover:text-white transition line-clamp-2"
        >
          {title}
        </a>

        <p className="text-sm text-white/65 leading-relaxed line-clamp-3">
          {snippet}
        </p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onPreview?.({ title, link })}
            className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
          >
            👁 Preview
          </button>

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
  );
}
