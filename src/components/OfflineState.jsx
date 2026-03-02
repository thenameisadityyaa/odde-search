import { WifiOff } from "lucide-react";

export default function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeDown">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6">
        <WifiOff size={32} className="text-amber-400" />
      </div>
      <h3 className="text-2xl font-bold text-main">You're offline</h3>
      <p className="mt-3 text-muted max-w-sm leading-relaxed">
        Please check your internet connection to continue searching.
        We'll automatically reconnect when you're back online.
      </p>
    </div>
  );
}