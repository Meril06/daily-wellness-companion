import { motion } from "framer-motion";
import type { Mood } from "../types";

interface MoodOption {
  id: Mood;
  label: string;
  emoji: string;
  activeBg: string;
  activeShadow: string;
}

const MOODS: MoodOption[] = [
  { id: "great", label: "Great", emoji: "😄", activeBg: "#4ade80", activeShadow: "rgba(74,222,128,0.45)" },
  { id: "okay", label: "Okay", emoji: "🙂", activeBg: "#60a5fa", activeShadow: "rgba(96,165,250,0.45)" },
  { id: "low", label: "Low", emoji: "😕", activeBg: "#fbbf24", activeShadow: "rgba(251,191,36,0.45)" },
  { id: "stressed", label: "Stressed", emoji: "😣", activeBg: "#fb7185", activeShadow: "rgba(251,113,133,0.45)" },
];

interface MoodPickerProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MOODS.map((m) => {
        const selected = value === m.id;
        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            whileTap={{ scale: 0.92 }}
            animate={
              selected
                ? { scale: [1, 1.08, 1], backgroundColor: m.activeBg }
                : { scale: 1, backgroundColor: "rgba(18,22,42,0.7)" }
            }
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 rounded-xl2 border border-white/[0.06] px-4 py-5"
            style={{
              boxShadow: selected ? `0 0 26px 3px ${m.activeShadow}` : undefined,
            }}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span
              className={`font-display text-sm font-semibold ${
                selected ? "text-base-950" : "text-slate-200"
              }`}
            >
              {m.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
