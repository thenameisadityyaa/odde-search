import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-white/75 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 pt-3">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight"
            onClick={() => setOpen(false)}
          >
            Odde<span className="text-blue-400">Search</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/search" className={navClass}>
              Search
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="sm:hidden rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/80 hover:bg-white/10 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <span className="text-lg">✕</span>
            ) : (
              <span className="text-lg">☰</span>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden mt-3 glass rounded-2xl p-3 animate-[fadeDown_200ms_ease-out]">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                Search
              </NavLink>
              <NavLink
                to="/about"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
