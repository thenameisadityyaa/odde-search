import { useState } from "react";
import { Search, Image as ImageIcon, Newspaper, Star, Shield, Zap } from "lucide-react";
import SearchBar from "../components/SearchBar";
import RecentChips from "../components/RecentChips";
import { getRecentSearches } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [recent] = useState(() => getRecentSearches(user?.id));

  return (
    <div className="min-h-screen bg-app relative">
      {/* Subtle radial accent — very faint, not glowy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, rgba(251,84,43,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-32">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="text-center animate-reveal" style={{ opacity: 0 }}>
          {/* Eyebrow label */}
          <div
            className="inline-flex items-center gap-2 mb-10"
            style={{
              fontSize: "11px",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            Private · Fast · Open
          </div>

          {/* Headline — Syne display font */}
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text-main)",
              marginBottom: "1.25rem",
            }}
          >
            Search the web
            <br />
            <span style={{ color: "var(--accent)" }}>your way.</span>
          </h1>

          {/* Sub-headline — Manrope */}
          <p
            className="delay-1 animate-reveal"
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              maxWidth: "480px",
              margin: "0 auto 3rem",
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            Fast, private, and beautifully minimal. Everything you need,
            nothing you don&apos;t.
          </p>

          {/* Search bar */}
          <div
            className="delay-2 animate-reveal"
            style={{ opacity: 0, maxWidth: "600px", margin: "0 auto 1.5rem" }}
          >
            <SearchBar size="lg" />
          </div>

          {/* Recent chips */}
          <div className="delay-3 animate-reveal" style={{ opacity: 0 }}>
            <RecentChips items={recent} />
          </div>
        </section>

        {/* ── Divider ───────────────────────────────────────── */}
        <div
          style={{
            height: "1px",
            background: "var(--border)",
            margin: "5rem 0 4rem",
          }}
        />

        {/* ── Features ──────────────────────────────────────── */}
        <section>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            What&apos;s inside
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1px",
              background: "var(--border)",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <FeatureCell icon={<Search size={18} />} title="Web Search" desc="Instant results across the open web." delay="0.1s" accent="var(--accent)" />
            <FeatureCell icon={<ImageIcon size={18} />} title="Image Search" desc="High-resolution image discovery." delay="0.16s" accent="var(--accent-2)" />
            <FeatureCell icon={<Newspaper size={18} />} title="News" desc="Real-time headlines from global sources." delay="0.22s" accent="var(--accent)" />
            <FeatureCell icon={<Star size={18} />} title="Saved Results" desc="Bookmark and revisit your findings." delay="0.28s" accent="var(--accent-2)" />
            <FeatureCell icon={<Shield size={18} />} title="Privacy First" desc="No tracking, no profiling. Ever." delay="0.34s" accent="var(--accent)" />
            <FeatureCell icon={<Zap size={18} />} title="Instant" desc="Sub-second response with smart caching." delay="0.40s" accent="var(--accent-2)" />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCell({ icon, title, desc, delay, accent }) {
  return (
    <div
      className="animate-reveal"
      style={{
        opacity: 0,
        animationDelay: delay,
        background: "var(--bg-color)",
        padding: "1.75rem 1.5rem",
        cursor: "default",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-color)";
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          marginBottom: "1rem",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 700,
          fontSize: "0.93rem",
          color: "var(--text-main)",
          marginBottom: "0.4rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  );
}
