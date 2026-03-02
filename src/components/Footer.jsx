export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Odde Search. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-muted hover:text-main transition-colors">Privacy</a>
          <a href="#" className="text-xs text-muted hover:text-main transition-colors">Terms</a>
          <a href="#" className="text-xs text-muted hover:text-main transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}
