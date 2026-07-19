import { motion } from "framer-motion";

interface XPBarProps {
  current: number;
  needed: number;
  level: number;
}

export default function XPBar({ current, needed, level }: XPBarProps) {
  const pct = Math.min(100, (current / needed) * 100);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
        <span>Level {level}</span>
        <span>
          {current} / {needed} XP
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-base-700/80">
        <motion.div
          className="h-full rounded-full bg-grad-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px 1px rgba(139,125,255,0.5)" }}
        />
      </div>
    </div>
  );
}
