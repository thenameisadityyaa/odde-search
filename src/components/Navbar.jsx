import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          OddeSearch
        </Link>

        <div className="flex gap-5 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/search" className="hover:text-blue-600">Search</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
        </div>
      </div>
    </nav>
  );
}
