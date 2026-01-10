export default function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="glass rounded-2xl p-6 text-center border border-red-500/30">
      <div className="text-4xl">⚠️</div>
      <h3 className="mt-3 text-lg font-semibold text-red-300">
        Unable to load results
      </h3>
      <p className="mt-2 text-sm text-white/60">{message}</p>
    </div>
  );
}
