import { Clock, X } from "lucide-react";

export default function RecentChips({ items = [], onSelect, onRemove }) {
  if (!items.length) return null;

  return (
    <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
      {items.map((q, idx) => (
        <div
          key={idx}
          onClick={() => onSelect?.(q)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 99,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            fontSize: "0.78rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            color: "var(--text-muted)",
            cursor: "pointer",
            userSelect: "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-main)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <Clock size={11} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          <span>{q}</span>
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(q); }}
              style={{ padding: 1, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-faint)", display: "flex", alignItems: "center" }}
            >
              <X size={10} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

