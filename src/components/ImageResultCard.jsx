import { Maximize2, ExternalLink } from "lucide-react";

export default function ImageResultCard({ result, onPreview }) {
  const { title, link, image, displayLink } = result;

  return (
    <div className="group relative glass rounded-3xl overflow-hidden cursor-pointer aspect-square sm:aspect-video lg:aspect-square">
      <img
        src={link}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(result);
            }}
            className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            <Maximize2 size={16} />
          </button>
          <a
            href={image?.contextLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">
            {displayLink}
          </p>
          <p className="text-sm font-bold text-white line-clamp-2 leading-tight">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
