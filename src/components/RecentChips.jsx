import { Clock, X } from "lucide-react";

export default function RecentChips({ items = [], onSelect, onRemove }) {
  if (!items.length) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      {items.map((q, idx) => (
        <div
          key={idx}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-muted hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          onClick={() => onSelect(q)}
        >
          <Clock size={12} className="text-blue-400/60" />
          <span className="font-medium">{q}</span>
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(q);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/10 transition-all"
            >
              <X size={10} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
