import { useState } from "react";
import EmptyState from "../components/EmptyState";
import ResultCard from "../components/ResultCard";
import { getSaved, removeSaved } from "../utils/saved";
import { Bookmark, Trash2, Share2, ExternalLink } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Saved() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(() => getSaved(user?.id));

  const handleRemove = (link) => {
    const updated = removeSaved(link, user?.id);
    setSaved(updated);
  };

  if (saved.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          title="No saved results"
          message="Save some results and they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Bookmark size={20} className="text-yellow-400" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-main">
            Saved <span className="text-blue-500">Results</span>
          </h1>
        </div>
        <p className="text-muted max-w-2xl leading-relaxed">
          Your bookmarked results are stored locally in your browser. You can access them anytime, even offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {saved.map((item) => (
          <div key={item.link} className="relative group">
            <ResultCard
              result={item}
              isSaved={true}
              onSave={() => handleRemove(item.link)}
            />
            <button
              onClick={() => handleRemove(item.link)}
              className="absolute top-6 right-16 p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
              title="Remove from saved"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
