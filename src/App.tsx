import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BackgroundBeams from "./components/BackgroundBeams";
import HomeScreen from "./screens/Home";
import CheckInScreen from "./screens/CheckIn";
import ResultScreen from "./screens/Result";
import { localStorageAdapter, todayISO } from "./lib/storage";
import { applyCheckIn, completeQuest } from "./lib/gamification";
import type { CheckInInput, CheckInRecord, CheckInResult, WellnessState } from "./types";

type Screen = "home" | "checkin" | "result";

export default function App() {
  const [state, setState] = useState<WellnessState>(() => localStorageAdapter.load());
  const [screen, setScreen] = useState<Screen>("home");
  const [pendingResult, setPendingResult] = useState<CheckInResult | null>(null);
  const [justUnlockedBadgeId, setJustUnlockedBadgeId] = useState<string | null>(null);

  useEffect(() => {
    localStorageAdapter.save(state);
  }, [state]);

  function handleCheckInComplete(input: CheckInInput, result: CheckInResult) {
    const record: CheckInRecord = { ...input, date: todayISO(), result };
    const { next, newBadgeIds } = applyCheckIn(state, record);
    setState(next);
    setPendingResult(result);
    if (newBadgeIds.length > 0) {
      setJustUnlockedBadgeId(newBadgeIds[0]);
      window.setTimeout(() => setJustUnlockedBadgeId(null), 2500);
    }
    setScreen("result");
  }

  function handleCompleteQuest(questId: Parameters<typeof completeQuest>[1]) {
    const { next, newBadgeIds } = completeQuest(state, questId);
    setState(next);
    if (newBadgeIds.length > 0) {
      setJustUnlockedBadgeId(newBadgeIds[0]);
      window.setTimeout(() => setJustUnlockedBadgeId(null), 2500);
    }
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundBeams />
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <HomeScreen
            key="home"
            state={state}
            onStartCheckIn={() => setScreen("checkin")}
            onCompleteQuest={handleCompleteQuest}
            justUnlockedBadgeId={justUnlockedBadgeId}
          />
        )}
        {screen === "checkin" && (
          <CheckInScreen
            key="checkin"
            onComplete={handleCheckInComplete}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "result" && pendingResult && (
          <ResultScreen
            key="result"
            result={pendingResult}
            onBackToHome={() => {
              setScreen("home");
              setPendingResult(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
