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
  const location = useLocation();
  const navigate = useNavigate();

  // close dropdown when route changes
  useEffect(() => {
    setShowUserMenu(false);
    setIsOpen(false);
  }, [location.pathname]);

  const navLinkStyle = (path) => ({
    fontSize: "13.5px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    color: location.pathname === path ? "var(--text-main)" : "var(--text-muted)",
    textDecoration: "none",
    padding: "4px 10px",
    borderRadius: 7,
    background: location.pathname === path ? "var(--surface-2)" : "transparent",
    transition: "color 0.15s, background 0.15s",
  });

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate("/login");
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName[0]?.toUpperCase();
  const avatarColor = profile?.avatar_color || "blue";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--bg-color)",
        borderBottom: "1px solid var(--border)",
        height: "var(--nav-height)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={15} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--text-main)",
              letterSpacing: "-0.02em",
            }}
          >
            odd<span style={{ color: "var(--accent)" }}>e</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <Link to="/" style={navLinkStyle("/")}>Home</Link>
              <Link to="/saved" style={navLinkStyle("/saved")}>Saved</Link>
              <Link to="/settings" style={navLinkStyle("/settings")}>Settings</Link>
            </>
          )}
          <Link to="/about" style={navLinkStyle("/about")}>About</Link>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Avatar / user menu */}
          {user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: `var(--accent)`,
                  border: "none",
                  color: "#fff",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  avatarLetter
                )}
              </button>

              {showUserMenu && (
                <div
                  className="animate-reveal"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 220,
                    background: "var(--surface)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                    zIndex: 60,
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontFamily: "Manrope", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Account</span>
                      <span style={{ fontSize: 9, fontFamily: "Manrope", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: profile?.role === "admin" ? "rgba(251,191,36,0.12)" : "var(--accent-soft)", color: profile?.role === "admin" ? "#f59e0b" : "var(--accent)" }}>
                        {profile?.role || "User"}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.83rem", fontFamily: "Manrope", fontWeight: 600, color: "var(--text-main)", marginBottom: 1 }}>{displayName}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <Link to="/settings" onClick={() => setShowUserMenu(false)} style={{ ...menuItemStyle() }}>
                    <SettingsIcon size={14} style={{ opacity: 0.6 }} /> Settings
                  </Link>
                  <Link to="/saved" onClick={() => setShowUserMenu(false)} style={{ ...menuItemStyle() }}>
                    <Bookmark size={14} style={{ opacity: 0.6 }} /> Saved Results
                  </Link>
                  <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                  <button onClick={handleSignOut} style={{ ...menuItemStyle(), color: "#f87171", width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden animate-reveal"
          style={{
            position: "fixed",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            background: "var(--bg-color)",
            borderBottom: "1px solid var(--border)",
            padding: "0.75rem 1.5rem 1rem",
            zIndex: 49,
          }}
        >
          {user && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MobileLink to="/" label="Home" active={location.pathname === "/"} onClick={() => setIsOpen(false)} />
              <MobileLink to="/saved" label="Saved" active={location.pathname === "/saved"} onClick={() => setIsOpen(false)} />
              <MobileLink to="/settings" label="Settings" active={location.pathname === "/settings"} onClick={() => setIsOpen(false)} />
            </div>
          )}
          <MobileLink to="/about" label="About" active={location.pathname === "/about"} onClick={() => setIsOpen(false)} />
          {user && (
            <>
              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
              <button
                onClick={() => { setIsOpen(false); handleSignOut(); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, color: "#f87171", fontSize: "0.88rem", fontFamily: "Inter", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", width: "100%" }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function menuItemStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    fontSize: "0.83rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    color: "var(--text-muted)",
    textDecoration: "none",
    background: "transparent",
    cursor: "pointer",
  };
}

function MobileLink({ to, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: "block",
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: "0.9rem",
        fontFamily: "Inter, sans-serif",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--text-main)" : "var(--text-muted)",
        background: active ? "var(--surface-2)" : "transparent",
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}
