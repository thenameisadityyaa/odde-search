import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LiquidBackground from "./components/LiquidBackground";
import ProtectedRoute from "./components/ProtectedRoute";

import useTheme from "./hooks/useTheme";
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

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-liquid text-white flex items-center justify-center p-4">
        <LiquidBackground />
        <div className="glass max-w-md w-full p-8 rounded-3xl border border-white/10 text-center shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-main mb-4">Supabase Setup Required</h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            To enable authentication and multi-user support, please add your Supabase credentials to the <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-400">.env</code> file.
          </p>
          <div className="space-y-3 text-left bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-[11px]">
            <p className="text-blue-400">VITE_SUPABASE_URL=...</p>
            <p className="text-blue-400">VITE_SUPABASE_ANON_KEY=...</p>
          </div>
          <p className="text-xs text-muted mt-8">
            Restart the development server after updating the file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-liquid text-white relative">
          <LiquidBackground />
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