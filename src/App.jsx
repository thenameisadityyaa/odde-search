import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LiquidBackground from "./components/LiquidBackground";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import About from "./pages/About";
import Saved from "./pages/Saved"; // ✅ Day 14
import Settings from "./pages/Settings"; // ✅ Day 15

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-liquid text-white relative">
        {/* Apple-like animated background */}
        <LiquidBackground />

        <Navbar />

        <main className="pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />

            {/* ✅ Day 14 */}
            <Route path="/saved" element={<Saved />} />

            {/* ✅ Day 15 */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
