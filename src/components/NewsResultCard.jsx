import { getDomain, truncate } from "../utils/format";

export default function NewsResultCard({ title, link, snippet }) {
  const domain = getDomain(link);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="group glass rounded-3xl p-5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/55">{domain}</p>
          <h3 className="mt-2 text-base font-semibold text-white/85 group-hover:text-white leading-snug">
            {title}
          </h3>

          <p className="mt-3 text-sm text-white/65 leading-relaxed">
            {truncate(snippet, 180)}
          </p>
        </div>

        <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-2xl">
          📰
        </div>
      </div>

      <div className="mt-4 text-xs text-blue-300/80 group-hover:text-blue-200">
        Read full article →
      </div>
    </a>
  );
}
