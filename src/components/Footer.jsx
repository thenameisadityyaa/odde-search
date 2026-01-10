export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Odde Search — Built with React + RapidAPI
      </div>
    </footer>
  );
}
