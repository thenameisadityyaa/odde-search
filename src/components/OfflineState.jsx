export default function OfflineState() {
  return (
    <div className="glass rounded-3xl p-6 border border-white/10 text-center">
      <p className="text-xl font-bold text-white/90">⚠️ You are Offline</p>
      <p className="mt-2 text-sm text-white/60 leading-relaxed">
        Internet connection is not available. Please reconnect and try again.
      </p>
    </div>
  );
}