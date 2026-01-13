import { useEffect, useState } from "react";
import { isSaved, removeSaved, saveItem } from "../utils/saved";

export default function ResultCard({
  title,
  link,
  snippet,
  onPreview,
  onDetails,
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSaved(isSaved(link));
  }, [link]);

  const toggleSave = () => {
    if (saved) {
      removeSaved(link);
      setSaved(false);
    } else {
      saveItem({ title, link, snippet, type: "web" });
      setSaved(true);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.log("Copy failed:", e);
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Odde Search Result",
          text: snippet || "",
          url: link,
        });
      } else {
        await copyLink();
      }
    } catch {
      // cancelled share
    }
  };

  return (
    <div className="glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition">
      <p className="text-xs text-white/45 truncate">{link}</p>

      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block text-lg font-bold text-white/90 hover:text-white transition line-clamp-2"
      >
        {title}
      </a>

      <p className="mt-2 text-sm text-white/65 leading-relaxed line-clamp-3">
        {snippet}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
        >
          ↗ Open
        </a>

        <button
          onClick={() => onPreview?.({ title, link })}
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
        >
          👁 Preview
        </button>

        {/* ✅ Day 16 */}
        <button
          onClick={() => onDetails?.({ title, link, snippet })}
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
        >
          ℹ Details
        </button>

        <button
          onClick={copyLink}
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
        >
          {copied ? "✅ Copied" : "🔗 Copy"}
        </button>

        <button
          onClick={shareLink}
          className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
        >
          📤 Share
        </button>

        <button
          onClick={toggleSave}
          className={`px-4 py-2 rounded-xl border transition active:scale-95 text-xs ${
            saved
              ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
              : "border-white/15 bg-white/10 text-white/85 hover:bg-white/15"
          }`}
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}
