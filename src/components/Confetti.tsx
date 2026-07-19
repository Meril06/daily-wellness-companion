import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  originX?: number; // 0-100, percentage of container width
  originY?: number;
}

const COLORS = ["#8b7dff", "#3ee0c8", "#fbbf24", "#fb7185", "#60a5fa"];

/**
 * A lightweight particle burst — no external confetti dependency, just a
 * handful of Framer Motion spans exploding outward from an origin point.
 */
export default function Confetti({ active, originX = 50, originY = 50 }: ConfettiProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.4;
        const distance = 60 + Math.random() * 70;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotate: Math.random() * 360,
          color: COLORS[i % COLORS.length],
          size: 4 + Math.random() * 5,
        };
      }),
    [active]
  );

  return (
    <AnimatePresence>
      {active && (
        <div
          className="pointer-events-none absolute inset-0 z-50"
          style={{ overflow: "visible" }}
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{
                opacity: 1,
                x: `${originX}%`,
                y: `${originY}%`,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                x: `calc(${originX}% + ${p.x}px)`,
                y: `calc(${originY}% + ${p.y}px)`,
                scale: 1,
                rotate: p.rotate,
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
