export default function ResultsSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass shimmer rounded-2xl p-5"
        >
          <div className="h-3 w-2/3 rounded bg-white/10" />
          <div className="mt-3 h-5 w-1/2 rounded bg-white/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-5/6 rounded bg-white/10" />
            <div className="h-3 w-4/6 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
