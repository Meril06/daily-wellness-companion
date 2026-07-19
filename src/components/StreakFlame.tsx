import { motion } from "framer-motion";

interface StreakFlameProps {
  streak: number;
}

export default function StreakFlame({ streak }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-base-800/70 border border-white/[0.06] px-3 py-1.5">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-grad-primary blur-md"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.25, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.svg
          viewBox="0 0 24 24"
          className="relative h-5 w-5 fill-transparent"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
          <path
            fill="url(#flameGrad)"
            d="M12 2c.7 3-2.3 3.7-2.3 6.8a3.8 3.8 0 007.5 0c0-1.5-.7-2.3-1.5-3 .4 1.5-.7 2.3-1.5 2.3-1.5 0-.8-2.3-.8-3-1.5.8-2.3 2.3-2.3 3.8a3.8 3.8 0 003.8 3.8 4.5 4.5 0 004.5-4.5C19.4 3.8 15.5 5 12 2z"
          />
        </motion.svg>
      </div>
      <span className="font-display text-sm font-semibold text-slate-100">
        {streak} day{streak === 1 ? "" : "s"}
      </span>
    </div>
  );
}
