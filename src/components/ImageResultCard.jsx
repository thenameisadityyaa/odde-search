import { getDomain } from "../utils/format";

export default function ImageResultCard({ title, link, snippet }) {
  const domain = getDomain(link);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
    >
      {/* Fake image preview (glass tile) */}
      <div className="aspect-4/3 w-full bg-white/5 border-b border-white/10 relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        <div className="text-center px-4">
          <div className="text-3xl">🖼️</div>
          <p className="mt-2 text-xs text-white/55">
            Preview not available
          </p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] text-white/55">{domain}</p>
        <h3 className="mt-1 text-sm font-semibold text-white/85 line-clamp-2 group-hover:text-white">
          {title}
        </h3>
        <p className="mt-2 text-xs text-white/60 line-clamp-2">{snippet}</p>
      </div>
    </a>
  );
}
