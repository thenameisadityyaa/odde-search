import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="glass mx-auto max-w-6xl px-4 py-3 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight"
          >
            Odde<span className="text-blue-400">Search</span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium text-white/80">
            <Link className="hover:text-white" to="/">
              Home
            </Link>
            <Link className="hover:text-white" to="/search">
              Search
            </Link>
            <Link className="hover:text-white" to="/about">
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
