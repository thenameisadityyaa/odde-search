export default function ResultCard({ title, link, snippet }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="block glass rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl"
    >
      <p className="text-xs text-white/50 break-all">{link}</p>

      <h3 className="mt-2 text-lg sm:text-xl font-semibold text-blue-300">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/70 leading-relaxed">{snippet}</p>

      <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/60">
        Open <span className="text-white/40">↗</span>
      </div>
    </a>
  );
}
