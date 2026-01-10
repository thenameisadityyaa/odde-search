export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <div className="glass rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/60 text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white/75">Odde Search</span>. All
            rights reserved.
          </p>

          <p className="text-xs text-white/50 text-center sm:text-right">
            Built with React + TailwindCSS v4.1 + RapidAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
