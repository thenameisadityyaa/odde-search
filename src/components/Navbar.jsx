import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Sun, Moon, LogOut, Settings as SettingsIcon, Bookmark } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = (path) =>
    `relative px-4 py-2 text-sm font-bold transition-all duration-300 ${location.pathname === path
      ? "text-blue-500"
      : "text-muted hover:text-main"
    }`;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate("/login");
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName[0]?.toUpperCase();
  const avatarColor = profile?.avatar_color || "blue";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-2xl border border-white/10 px-4 sm:px-6 transition-all duration-500 ${scrolled ? "shadow-2xl shadow-black/50" : "bg-transparent border-transparent"}`}>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Search size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-main">
                ODDE<span className="text-blue-500">SEARCH</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {user && (
                <>
                  <Link to="/" className={navClass("/")}>
                    Home
                    {location.pathname === "/" && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-500 rounded-full animate-reveal" />}
                  </Link>
                  <Link to="/saved" className={navClass("/saved")}>
                    Saved
                    {location.pathname === "/saved" && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-500 rounded-full animate-reveal" />}
                  </Link>
                  <Link to="/settings" className={navClass("/settings")}>
                    Settings
                    {location.pathname === "/settings" && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-500 rounded-full animate-reveal" />}
                  </Link>
                </>
              )}
              <Link to="/about" className={navClass("/about")}>
                About
                {location.pathname === "/about" && <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-500 rounded-full animate-reveal" />}
              </Link>

              <div className="w-px h-6 bg-white/10 mx-4" />

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-muted hover:text-main hover:bg-white/5 transition-all active:scale-90"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* User menu */}
              {user && (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all active:scale-95"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-${avatarColor}-500 to-${avatarColor}-700 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-${avatarColor}-500/20 overflow-hidden`}>
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-64 glass-premium rounded-3xl border border-white/10 shadow-2xl py-3 animate-reveal z-50 overflow-hidden">
                      <div className="px-5 py-4 border-b border-white/5 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Signed In As</p>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border ${profile?.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                            {profile?.role || 'User'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-main truncate">{displayName}</p>
                        <p className="text-[10px] text-muted truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-muted hover:bg-white/5 hover:text-main transition-all"
                      >
                        <SettingsIcon size={16} className="opacity-70" />
                        Settings
                      </Link>

                      <Link
                        to="/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-muted hover:bg-white/5 hover:text-main transition-all"
                      >
                        <Bookmark size={16} className="opacity-70" />
                        Saved Results
                      </Link>

                      <div className="h-px bg-white/5 my-2 mx-5" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-muted hover:text-main"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-muted hover:text-main"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-reveal" onClick={() => setIsOpen(false)}>
          <div className="absolute top-24 left-4 right-4 glass-premium rounded-3xl p-6 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-2">
              {user && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${avatarColor}-600 to-${avatarColor}-800 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-${avatarColor}-500/20 overflow-hidden`}>
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-black text-muted uppercase tracking-widest">Signed In</p>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border ${profile?.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                        {profile?.role || 'User'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-main truncate">{displayName}</p>
                  </div>
                </div>
              )}

              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-main font-bold hover:bg-white/5 transition-all">Home</Link>
              <Link to="/saved" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-main font-bold hover:bg-white/5 transition-all">Saved</Link>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-main font-bold hover:bg-white/5 transition-all">Settings</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-main font-bold hover:bg-white/5 transition-all">About</Link>

              {user && (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <button
                    onClick={() => { setIsOpen(false); handleSignOut(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-400/10 transition-all text-left"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
