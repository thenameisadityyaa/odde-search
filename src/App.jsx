import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MouseFollower from "./components/MouseFollower";

import ProtectedRoute from "./components/ProtectedRoute";

import useTheme from "./hooks/useTheme";
import useLenis from "./hooks/useLenis";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import About from "./pages/About";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

function AppContent() {
  const { user, isConfigured } = useAuth();
  useTheme();
  useLenis();

  if (!isConfigured) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-color)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, background: "rgba(251,191,36,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.5rem" }}>⚠️</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.75rem" }}>Supabase Setup Required</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Add your Supabase credentials to the <code style={{ background: "var(--surface-2)", padding: "1px 5px", borderRadius: 4, fontSize: "0.8rem" }}>.env</code> file.
          </p>
          <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: 11, textAlign: "left", color: "var(--accent)" }}>
            <p>VITE_SUPABASE_URL=...</p>
            <p style={{ marginTop: 4 }}>VITE_SUPABASE_ANON_KEY=...</p>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: "1rem" }}>Restart the dev server after updating the file.</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-app relative">
          <MouseFollower />
          <Navbar />

          <main className="pt-[var(--nav-height)] pb-10">
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />

              {/* Protected */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home key={user?.id} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <Saved key={user?.id} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings key={user?.id} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
}