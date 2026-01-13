import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for premium animation
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);

      // close mobile menu while scrolling (nice UX)
      if (window.scrollY > 50) setOpen(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apple-like nav link with underline animation
  const navClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-white/12 text-white shadow-sm"
         : "text-white/75 hover:text-white hover:bg-white/8"
     }
     group`;

  // Underline element (hover underline)
  const Underline = () => (
    <span
      className="
        absolute left-1/2 -translate-x-1/2 bottom-1
        h-[2px] w-0 rounded-full
        bg-linear-to-r from-blue-400 via-white/70 to-purple-400
        transition-all duration-300 ease-out
        group-hover:w-8
      "
    />
  );

  // Active underline (always visible for active link)
  const ActiveUnderline = () => (
    <span
      className="
        absolute left-1/2 -translate-x-1/2 bottom-1
        h-[2px] w-10 rounded-full
        bg-linear-to-r from-blue-400 via-white/70 to-purple-400
        shadow-[0_0_14px_rgba(96,165,250,0.35)]
      "
    />
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "pt-3" : "pt-4"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-4">
        <div
          className={`
            glass rounded-2xl px-4
            flex items-center justify-between
            transition-all duration-300 ease-out
            ${
              scrolled
                ? "py-2.5 shadow-2xl translate-y-1 border-white/18"
                : "py-3 shadow-xl translate-y-0 border-white/12"
            }
          `}
        >
          {/* Brand */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight group"
            onClick={() => setOpen(false)}
          >
            <span className="group-hover:text-white transition-colors">Odde</span>
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              Search
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-2">
            <NavLink to="/" className={navClass}>
              {({ isActive }) => (
                <>
                  Home
                  {isActive ? <ActiveUnderline /> : <Underline />}
                </>
              )}
            </NavLink>

            <NavLink to="/search" className={navClass}>
              {({ isActive }) => (
                <>
                  Search
                  {isActive ? <ActiveUnderline /> : <Underline />}
                </>
              )}
            </NavLink>

            <NavLink to="/saved" className={navClass}>
              {({ isActive }) => (
                <>
                  Saved
                  {isActive ? <ActiveUnderline /> : <Underline />}
                </>
              )}
            </NavLink>

            {/* ✅ Day 15 */}
            <NavLink to="/settings" className={navClass}>
              {({ isActive }) => (
                <>
                  Settings
                  {isActive ? <ActiveUnderline /> : <Underline />}
                </>
              )}
            </NavLink>

            <NavLink to="/about" className={navClass}>
              {({ isActive }) => (
                <>
                  About
                  {isActive ? <ActiveUnderline /> : <Underline />}
                </>
              )}
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="sm:hidden rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/85 hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <span className="text-lg">✕</span> : <span className="text-lg">☰</span>}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`
            sm:hidden overflow-hidden transition-all duration-300 ease-out
            ${open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}
          `}
        >
          <div className="glass rounded-2xl p-3">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <div className="w-full flex items-center justify-between">
                    <span>Home</span>
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        isActive ? "w-10 bg-blue-400" : "w-0 bg-blue-400"
                      }`}
                    />
                  </div>
                )}
              </NavLink>

              <NavLink to="/search" className={navClass} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <div className="w-full flex items-center justify-between">
                    <span>Search</span>
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        isActive ? "w-10 bg-blue-400" : "w-0 bg-blue-400"
                      }`}
                    />
                  </div>
                )}
              </NavLink>

              <NavLink to="/saved" className={navClass} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <div className="w-full flex items-center justify-between">
                    <span>Saved</span>
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        isActive ? "w-10 bg-blue-400" : "w-0 bg-blue-400"
                      }`}
                    />
                  </div>
                )}
              </NavLink>

              {/* ✅ Day 15 */}
              <NavLink to="/settings" className={navClass} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <div className="w-full flex items-center justify-between">
                    <span>Settings</span>
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        isActive ? "w-10 bg-blue-400" : "w-0 bg-blue-400"
                      }`}
                    />
                  </div>
                )}
              </NavLink>

              <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>
                {({ isActive }) => (
                  <div className="w-full flex items-center justify-between">
                    <span>About</span>
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        isActive ? "w-10 bg-blue-400" : "w-0 bg-blue-400"
                      }`}
                    />
                  </div>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
