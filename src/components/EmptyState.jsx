export default function EmptyState({ title, message }) {
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="text-4xl">🔎</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{message}</p>
    </div>
  );
}
