import { useMemo } from "react";

/**
 * Soft ambient background: a radial gradient glow plus a handful of
 * diagonal "meteor" streaks drifting slowly. Dark-mode-friendly, kept
 * subtle so it never competes with foreground content.
 */
export default function BackgroundBeams() {
  const meteors = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        top: Math.random() * 40,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base-950" />
      <div className="absolute inset-0 bg-grad-radial-glow" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(62,224,200,0.10), transparent 55%)",
        }}
      />
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute h-px w-24 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
