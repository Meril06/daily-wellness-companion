import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export default function ShimmerButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
}: ShimmerButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl2 px-6 py-3 font-display font-semibold text-base-950 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden bg-grad-primary shadow-glowViolet ${className}`}
    >
      {/* shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ animation: "shimmerSweep 2.6s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-120%); }
          60% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <LoadingDots />
            <span>Thinking…</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-base-950"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
