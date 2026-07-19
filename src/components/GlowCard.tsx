import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; // rgba string
  onClick?: () => void;
  as?: "div" | "button";
}

/**
 * Spotlight card pattern: a radial highlight tracks the pointer position
 * via CSS custom properties, layered over a glassy gradient-bordered card.
 */
export default function GlowCard({
  children,
  className = "",
  glowColor = "rgba(139, 125, 255, 0.35)",
  onClick,
  as = "div",
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  const Comp = motion.div;

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      role={as === "button" ? "button" : undefined}
      tabIndex={as === "button" ? 0 : undefined}
      className={`group relative overflow-hidden rounded-xl2 glass-card p-5 transition-shadow duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        boxShadow: hovering
          ? `0 0 32px 4px ${glowColor}`
          : "0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </Comp>
  );
}
