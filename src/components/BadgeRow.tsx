import { motion } from "framer-motion";
import type { BadgeDef } from "../types";

interface BadgeRowProps {
  badges: BadgeDef[];
  unlockedIds: string[];
  justUnlockedId?: string | null;
}

export default function BadgeRow({ badges, unlockedIds, justUnlockedId }: BadgeRowProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => {
        const unlocked = unlockedIds.includes(badge.id);
        const justUnlocked = justUnlockedId === badge.id;
        return (
          <motion.div
            key={badge.id}
            initial={justUnlocked ? { scale: 0.4, opacity: 0 } : false}
            animate={
              justUnlocked
                ? { scale: [0.4, 1.15, 1], opacity: 1 }
                : { opacity: 1 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-1.5"
            title={badge.description}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                unlocked
                  ? "border-white/10 bg-grad-primary"
                  : "border-white/[0.06] bg-base-700/60 grayscale"
              }`}
              style={{
                boxShadow: unlocked ? "0 0 18px 2px rgba(139,125,255,0.5)" : undefined,
                animation: unlocked ? "badgePulse 3s ease-in-out infinite" : undefined,
              }}
            >
              {unlocked ? (
                <span className="text-lg">✦</span>
              ) : (
                <LockIcon />
              )}
            </div>
            <span className="max-w-[64px] text-center text-[10px] leading-tight text-slate-400">
              {badge.label}
            </span>
          </motion.div>
        );
      })}
      <style>{`
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 18px 2px rgba(139,125,255,0.35); }
          50% { box-shadow: 0 0 22px 4px rgba(139,125,255,0.6); }
        }
      `}</style>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-slate-500" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
