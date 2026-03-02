export default function SearchTabs({ active = "all", onChange }) {
  const tabs = [
    { key: "all", label: "All" },
    { key: "images", label: "Images" },
    { key: "news", label: "News" },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium border transition ${isActive
                ? "bg-white/10 border-white/20 text-main"
                : "bg-white/5 border-white/10 text-muted hover:text-main hover:bg-white/10"
              }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
