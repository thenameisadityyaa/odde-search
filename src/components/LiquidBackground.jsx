export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Blob 1 */}
      <div
        className="liquid-blob"
        style={{
          width: "520px",
          height: "520px",
          left: "-120px",
          top: "-140px",
          background: "rgba(59, 130, 246, 0.45)", // blue glow
          animation: "floatSlow 10s ease-in-out infinite",
        }}
      />

      {/* Blob 2 */}
      <div
        className="liquid-blob"
        style={{
          width: "520px",
          height: "520px",
          right: "-160px",
          top: "40px",
          background: "rgba(168, 85, 247, 0.45)", // purple glow
          animation: "floatSlower 14s ease-in-out infinite",
        }}
      />

      {/* Blob 3 */}
      <div
        className="liquid-blob"
        style={{
          width: "520px",
          height: "520px",
          left: "25%",
          bottom: "-220px",
          background: "rgba(34, 197, 94, 0.35)", // green glow
          animation: "floatReverse 12s ease-in-out infinite",
        }}
      />

      {/* Soft overlay to keep it premium and reduce contrast */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
