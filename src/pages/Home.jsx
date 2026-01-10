import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/70">
          ✨ Liquid Glass UI • Fast • Beginner Friendly
        </div>

        <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Explore the Web with{" "}
          <span className="text-blue-400">Odde Search</span>
        </h1>

        <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          A modern Google-style search experience built using React and RapidAPI.
          Designed for learning, speed, and a clean Apple-like UI.
        </p>

        <div className="mt-8">
          <SearchBar size="lg" />
        </div>
      </section>

      {/* Glass Feature Cards */}
      <section className="mt-12 pb-16">
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
