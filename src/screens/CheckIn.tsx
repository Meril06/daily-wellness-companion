import { useState } from "react";
import { motion } from "framer-motion";
import MoodPicker from "../components/MoodPicker";
import GlowSlider from "../components/GlowSlider";
import ShimmerButton from "../components/ShimmerButton";
import GlowCard from "../components/GlowCard";
import { submitCheckIn } from "../lib/api";
import type { CheckInResult, Mood } from "../types";

interface CheckInScreenProps {
  onComplete: (input: { mood: Mood; sleepHours: number; energyLevel: number; note?: string }, result: CheckInResult) => void;
  onBack: () => void;
}

export default function CheckInScreen({ onComplete, onBack }: CheckInScreenProps) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!mood) {
      setError("Pick how you're feeling to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    const input = { mood, sleepHours, energyLevel, note: note.trim() || undefined };
    try {
      const result = await submitCheckIn(input);
      onComplete(input, result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong reaching your check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-10 pt-10 sm:pt-16"
    >
      <button
        onClick={onBack}
        className="w-fit text-sm text-slate-400 transition-colors hover:text-slate-200"
      >
        ← Back to home
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          How are you, really?
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Takes 30 seconds. Your check-in shapes today's feedback.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-slate-300">Mood</h2>
        <MoodPicker value={mood} onChange={setMood} />
      </section>

      <GlowCard className="flex flex-col gap-6">
        <GlowSlider
          label="Sleep last night"
          value={sleepHours}
          min={0}
          max={12}
          step={0.5}
          unit="h"
          onChange={setSleepHours}
          gradient="linear-gradient(90deg, #3ee0c8, #4ade80)"
        />
        <GlowSlider
          label="Energy level"
          value={energyLevel}
          min={1}
          max={10}
          unit="/10"
          onChange={setEnergyLevel}
        />
      </GlowCard>

      <section className="flex flex-col gap-2">
        <label htmlFor="note" className="text-sm font-medium text-slate-300">
          Anything on your mind? <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Totally optional — a sentence or two is plenty."
          className="glass-card w-full resize-none rounded-xl2 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
      </section>

      {error && <p className="text-sm text-mood-coral">{error}</p>}

      <ShimmerButton onClick={handleSubmit} loading={loading} className="mt-2 w-full">
        Get my check-in
      </ShimmerButton>
    </motion.div>
  );
}
