export default function SearchTabs({ activeTab = "web", onTabChange }) {
  const tabs = [
    { key: "web", label: "All" },
    { key: "image", label: "Images" },
    { key: "news", label: "News" },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
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
