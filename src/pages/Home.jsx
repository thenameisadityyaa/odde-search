import { useState } from "react";
import { Search, Image as ImageIcon, Newspaper, Star, Shield, Zap, ArrowRight, Sparkles } from "lucide-react";
import SearchBar from "../components/SearchBar";
import RecentChips from "../components/RecentChips";
import { getRecentSearches } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [recent] = useState(() => getRecentSearches(user?.id));

  return (
    <div className="max-w-7xl mx-auto px-4 pb-32 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Hero Section */}
      <section className="text-center relative z-10 animate-reveal">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-10 shadow-xl">
          <Sparkles size={14} className="animate-pulse" />
          Next Generation Search
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-main leading-[0.9] mb-8">
          Search with <br />
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Infinite Clarity.
          </span>
        </h1>

        <p className="text-muted max-w-2xl mx-auto text-lg sm:text-xl font-medium leading-relaxed mb-16 opacity-80">
          Experience a search engine designed for the modern era.
          Fast, private, and breathtakingly beautiful.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="glass-premium rounded-[2.5rem] p-2 mb-8 shadow-2xl shadow-blue-500/10">
            <SearchBar size="lg" />
          </div>
          <RecentChips items={recent} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Search className="text-blue-400" />}
          title="Web Intelligence"
          desc="Access the world's information with real-time results powered by advanced indexing."
          delay="0s"
        />
        <FeatureCard
          icon={<ImageIcon className="text-indigo-400" />}
          title="Visual Discovery"
          desc="Immerse yourself in a high-fidelity image gallery with seamless masonry layouts."
          delay="0.1s"
        />
        <FeatureCard
          icon={<Newspaper className="text-blue-300" />}
          title="Global Insights"
          desc="Stay ahead of the curve with real-time news updates from verified global sources."
          delay="0.2s"
        />
        <FeatureCard
          icon={<Star className="text-blue-500" />}
          title="Personal Library"
          desc="Curate your own knowledge base by saving results directly to your secure account."
          delay="0.3s"
        />
        <FeatureCard
          icon={<Shield className="text-indigo-500" />}
          title="Privacy Fortress"
          desc="Your data is your own. We prioritize your privacy with local-first processing."
          delay="0.4s"
        />
        <FeatureCard
          icon={<Zap className="text-blue-400" />}
          title="Instant Response"
          desc="Experience zero-latency search with intelligent caching and lightning-fast delivery."
          delay="0.5s"
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="glass-premium rounded-[2rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border border-white/5 hover:border-blue-500/30 animate-reveal"
      style={{ animationDelay: delay }}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-main mb-4 tracking-tight">{title}</h3>
      <p className="text-muted text-sm leading-relaxed font-medium opacity-70">{desc}</p>
    </div>
  );
}
