import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SuggestionsPanel from "../components/SuggestionsPanel";
import { clearRecentSearches, getRecentSearches } from "../utils/storage";

const TRENDING = [
  "React Router best practices",
  "Tailwind CSS v4.1 liquid glass UI",
  "How APIs work in web apps",
  "Build a Google search clone",
  "TanStack Query caching",
  "Vercel deploy React app",
];

export default function Home() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const handleSelect = (value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleClear = () => {
    clearRecentSearches();
    setRecent([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/70">
          ✨ Liquid Glass UI • Fast • Beginner Friendly
        </div>

        <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Explore the Web with <span className="text-blue-400">Odde Search</span>
        </h1>

        <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          A modern Google-style search experience built using React and RapidAPI.
          Designed for learning, speed, and a clean Apple-like UI.
        </p>

        {/* SearchBar */}
        <div className="mt-8">
          <SearchBar
            size="lg"
            suggestions={[...recent, ...TRENDING]}
            onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
            onDropdownChange={setDropdownOpen}
          />
        </div>

        {/* ✅ FIXED: SuggestionsPanel stays in layout (no jumping)
            - When dropdown is open -> panel becomes invisible but keeps space */}
        <div className="mt-6 max-w-2xl mx-auto relative">
          {/* Optional overlay effect when dropdown open */}
          {dropdownOpen && (
            <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm z-10 pointer-events-none" />
          )}

          <div
            className={`transition-all duration-200 ${
              dropdownOpen
                ? "opacity-0 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            <SuggestionsPanel
              recent={recent}
              trending={TRENDING}
              onSelect={handleSelect}
              onClear={handleClear}
            />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon="🌐"
            title="Real-time Search"
            desc="Fetch live results instantly using Google Search API from RapidAPI."
          />
          <FeatureCard
            icon="🧊"
            title="Liquid Glass UI"
            desc="Frosted glass layout with blur effects, glow hover, and smooth animation."
          />
          <FeatureCard
            icon="🚀"
            title="Learn by Building"
            desc="Understand how APIs work and build a real-world React project step-by-step."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{desc}</p>
    </div>
  );
}
