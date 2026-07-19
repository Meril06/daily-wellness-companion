import { motion } from "framer-motion";
import ShimmerButton from "../components/ShimmerButton";
import Disclaimer from "../components/Disclaimer";
import type { CheckInResult } from "../types";

interface ResultScreenProps {
  result: CheckInResult;
  onBackToHome: () => void;
}

const COLOR_MAP: Record<CheckInResult["mood_color"], { hex: string; glow: string }> = {
  green: { hex: "#4ade80", glow: "rgba(74,222,128,0.4)" },
  blue: { hex: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
  amber: { hex: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  coral: { hex: "#fb7185", glow: "rgba(251,113,133,0.4)" },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ResultScreen({ result, onBackToHome }: ResultScreenProps) {
  const color = COLOR_MAP[result.mood_color];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-5 pb-12 pt-14 text-center sm:pt-20"
    >
      <motion.div
        variants={item}
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle, ${color.hex}33, transparent 70%)`,
          boxShadow: `0 0 40px 6px ${color.glow}`,
        }}
      >
        <div
          className="h-10 w-10 rounded-full"
          style={{ background: color.hex, boxShadow: `0 0 20px 4px ${color.glow}` }}
        />
      </motion.div>

      <motion.h1 variants={item} className="font-display text-2xl font-semibold sm:text-3xl">
        {result.title}
      </motion.h1>

      <motion.p variants={item} className="max-w-md text-base leading-relaxed text-slate-300">
        {result.message}
      </motion.p>

      <motion.div variants={item} className="flex w-full flex-col gap-3 sm:flex-row">
        {result.suggestions.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="glass-card flex-1 rounded-xl2 px-4 py-4 text-sm text-slate-200"
            style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04)` }}
          >
            <motion.span
              className="mb-2 inline-block text-lg"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              ✦
            </motion.span>
            <p>{s}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="mt-2 w-full max-w-xs">
        <ShimmerButton onClick={onBackToHome} className="w-full">
          Back to home
        </ShimmerButton>
      </motion.div>

      <motion.div variants={item}>
        <Disclaimer />
      </motion.div>
    </motion.div>
  );
}
