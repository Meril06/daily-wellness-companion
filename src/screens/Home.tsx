import { useState } from "react";
import { motion } from "framer-motion";
import StreakFlame from "../components/StreakFlame";
import XPBar from "../components/XPBar";
import GlowCard from "../components/GlowCard";
import Heatmap from "../components/Heatmap";
import BadgeRow from "../components/BadgeRow";
import Confetti from "../components/Confetti";
import NumberTicker from "../components/NumberTicker";
import Disclaimer from "../components/Disclaimer";
import { BADGES, QUESTS, lastTwoWeeks, xpIntoLevel } from "../lib/gamification";
import type { WellnessState } from "../types";

interface HomeScreenProps {
  state: WellnessState;
  onStartCheckIn: () => void;
  onCompleteQuest: (questId: (typeof QUESTS)[number]["id"]) => void;
  justUnlockedBadgeId: string | null;
}

export default function HomeScreen({
  state,
  onStartCheckIn,
  onCompleteQuest,
  justUnlockedBadgeId,
}: HomeScreenProps) {
  const { current, needed } = xpIntoLevel(state.xp);
  const days = lastTwoWeeks(state.history);
  const [burst, setBurst] = useState<{ id: number } | null>(null);

  function handleQuestClick(questId: (typeof QUESTS)[number]["id"]) {
    if (questId === "checkin") {
      onStartCheckIn();
      return;
    }
    if (state.completedQuestsToday.includes(questId)) return;
    setBurst({ id: Date.now() });
    onCompleteQuest(questId);
    window.setTimeout(() => setBurst(null), 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-10 pt-10 sm:pt-14"
    >
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Welcome back,</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{state.name}</h1>
        </div>
        <StreakFlame streak={state.streak} />
      </header>

      <GlowCard glowColor="rgba(139, 125, 255, 0.3)">
        <XPBar current={current} needed={needed} level={state.level} />
        <p className="mt-2 text-xs text-slate-500">
          Total XP: <NumberTicker value={state.xp} />
        </p>
      </GlowCard>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-slate-300">Today's quests</h2>
        <div className="flex flex-col gap-3">
          {QUESTS.map((quest) => {
            const done = state.completedQuestsToday.includes(quest.id);
            return (
              <GlowCard
                key={quest.id}
                onClick={() => handleQuestClick(quest.id)}
                glowColor={done ? "rgba(62, 224, 200, 0.25)" : "rgba(139, 125, 255, 0.3)"}
                className="relative flex items-center justify-between !py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      done ? "bg-grad-teal text-base-950" : "bg-base-700/70 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : "•"}
                  </span>
                  <span className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-200"}`}>
                    {quest.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">+{quest.xp} XP</span>
                {burst && quest.id !== "checkin" && (
                  <Confetti active originX={90} originY={50} />
                )}
              </GlowCard>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-slate-300">Last 2 weeks</h2>
        <GlowCard glowColor="rgba(96, 165, 250, 0.25)">
          <Heatmap days={days} />
        </GlowCard>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-slate-300">Badges</h2>
        <GlowCard glowColor="rgba(251, 191, 36, 0.2)">
          <BadgeRow
            badges={BADGES}
            unlockedIds={state.unlockedBadgeIds}
            justUnlockedId={justUnlockedBadgeId}
          />
        </GlowCard>
      </section>

      <Disclaimer />
    </motion.div>
  );
}
