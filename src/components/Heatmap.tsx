import { motion } from "framer-motion";

interface HeatmapProps {
  days: { date: string; color: string | null }[];
}

const COLOR_MAP: Record<string, string> = {
  green: "#4ade80",
  blue: "#60a5fa",
  amber: "#fbbf24",
  coral: "#fb7185",
};

export default function Heatmap({ days }: HeatmapProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => {
        const bg = day.color ? COLOR_MAP[day.color] : undefined;
        return (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.035, duration: 0.35, ease: "easeOut" }}
            className="aspect-square rounded-md"
            style={{
              background: bg ?? "rgba(255,255,255,0.06)",
              boxShadow: bg ? `0 0 10px 0 ${bg}66` : undefined,
            }}
            title={day.date}
          />
        );
      })}
    </div>
  );
}
