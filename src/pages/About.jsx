export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="glass rounded-3xl p-6 sm:p-10">
        {/* Heading */}
        <div className="flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/70">
            📌 Project Info
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About <span className="text-blue-400">Odde Search</span>
          </h1>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-3xl">
            Odde Search is a lightweight web-browsing and search application
            inspired by modern search platforms. It is built using React and the
            Google Search API from RapidAPI to demonstrate how real-time search
            results can be fetched and displayed in web applications.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard
            title="🎯 Purpose"
            desc="To help beginners understand how search engines work using APIs. The project teaches API fetching, UI building, and React architecture through hands-on development."
          />

          <InfoCard
            title="⚙️ Technology Stack"
            desc="React + Vite, TailwindCSS v4.1, React Router DOM, RapidAPI (Google Search API). The focus is on clean UI, performance, and beginner-friendly design."
          />

          <InfoCard
            title="✨ Key Features"
            desc="Modern liquid-glass UI, responsive layout, query navigation, real-time API integration (upcoming), error handling, smooth performance, and user-friendly interface."
          />

          <InfoCard
            title="🚀 Educational Value"
            desc="By building Odde Search, students learn modern frontend development, API integration, UI/UX best practices, and professional project workflow using GitHub."
          />
        </div>

        {/* Bottom Note */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-white/65 text-sm leading-relaxed">
            This project is designed to be simple, smooth, and visually
            appealing—serving both as a functional web app and a learning tool
            for students and beginners.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, desc }) {
  return (
    <div className="glass-soft rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{desc}</p>
    </div>
  );
}
