import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import { getSaved, removeSaved } from "../utils/saved";

export default function Saved() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(getSaved());
  }, []);

  if (saved.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <EmptyState
          title="No saved results"
          message="Save some results and they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white/90">Saved Results</h1>
        <p className="mt-2 text-sm text-white/55">
          Your bookmarked results are stored locally in your browser.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {saved.map((item) => (
          <div
            key={item.link}
            className="glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition"
          >
            <p className="text-xs text-white/45 truncate">{item.link}</p>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-lg font-bold text-white/90 hover:text-white transition line-clamp-2"
            >
              {item.title}
            </a>

            <p className="mt-2 text-sm text-white/65 leading-relaxed line-clamp-3">
              {item.snippet}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 text-white/85 hover:bg-white/15 transition active:scale-95 text-xs"
              >
                ↗ Open
              </a>

              <button
                onClick={() => {
                  const updated = removeSaved(item.link);
                  setSaved(updated);
                }}
                className="px-4 py-2 rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15 transition active:scale-95 text-xs"
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
