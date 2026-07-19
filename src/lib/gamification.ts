import type { BadgeDef, CheckInRecord, Quest, WellnessState } from "../types";
import { daysBetween, todayISO } from "./storage";

export const QUESTS: Quest[] = [
  { id: "checkin", label: "Complete today's check-in", xp: 20 },
  { id: "breathing", label: "Try a 60-second breathing exercise", xp: 10 },
  { id: "sleep", label: "Log last night's sleep", xp: 10 },
];

export const BADGES: BadgeDef[] = [
  { id: "first-step", label: "First Step", description: "Complete your first check-in" },
  { id: "three-streak", label: "On a Roll", description: "Reach a 3-day streak" },
  { id: "week-streak", label: "Full Week", description: "Reach a 7-day streak" },
  { id: "level-5", label: "Leveling Up", description: "Reach level 5" },
  { id: "ten-checkins", label: "Regular", description: "Log 10 check-ins" },
];

const XP_PER_LEVEL = 100;

export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): { current: number; needed: number } {
  const current = xp % XP_PER_LEVEL;
  return { current, needed: XP_PER_LEVEL };
}

/** Recomputes streak given the last check-in date and today. */
export function nextStreak(state: WellnessState): number {
  if (!state.lastCheckInDate) return 1;
  const gap = daysBetween(state.lastCheckInDate, todayISO());
  if (gap === 0) return state.streak; // already checked in today
  if (gap === 1) return state.streak + 1;
  return 1; // streak broken, restart
}

export function unlockableBadges(state: WellnessState): string[] {
  const unlocked = new Set(state.unlockedBadgeIds);
  const newly: string[] = [];

  const checkAndAdd = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) newly.push(id);
  };

  checkAndAdd("first-step", state.history.length >= 1);
  checkAndAdd("three-streak", state.streak >= 3);
  checkAndAdd("week-streak", state.streak >= 7);
  checkAndAdd("level-5", state.level >= 5);
  checkAndAdd("ten-checkins", state.history.length >= 10);

  return newly;
}

/**
 * Applies a completed check-in to state: adds history, XP, streak,
 * quest completion, badge unlocks. Pure function — returns new state.
 */
export function applyCheckIn(
  state: WellnessState,
  record: CheckInRecord
): { next: WellnessState; xpGained: number; newBadgeIds: string[] } {
  const streak = nextStreak(state);
  const questXp = QUESTS.find((q) => q.id === "checkin")!.xp;
  const xpGained = questXp;
  const xp = state.xp + xpGained;
  const level = levelForXp(xp);

  const completedQuestsToday: WellnessState["completedQuestsToday"] =
    state.lastCheckInDate === record.date
      ? Array.from(new Set([...state.completedQuestsToday, "checkin" as const]))
      : ["checkin"];

  const withHistory: WellnessState = {
    ...state,
    xp,
    level,
    streak,
    lastCheckInDate: record.date,
    history: [...state.history, record],
    completedQuestsToday,
  };

  const newBadgeIds = unlockableBadges(withHistory);

  const next: WellnessState = {
    ...withHistory,
    unlockedBadgeIds: [...withHistory.unlockedBadgeIds, ...newBadgeIds],
  };

  return { next, xpGained, newBadgeIds };
}

export function completeQuest(
  state: WellnessState,
  questId: Quest["id"]
): { next: WellnessState; xpGained: number; newBadgeIds: string[] } {
  if (state.completedQuestsToday.includes(questId)) {
    return { next: state, xpGained: 0, newBadgeIds: [] };
  }
  const quest = QUESTS.find((q) => q.id === questId)!;
  const xp = state.xp + quest.xp;
  const level = levelForXp(xp);
  const withQuest: WellnessState = {
    ...state,
    xp,
    level,
    completedQuestsToday: [...state.completedQuestsToday, questId],
  };
  const newBadgeIds = unlockableBadges(withQuest);
  const next: WellnessState = {
    ...withQuest,
    unlockedBadgeIds: [...withQuest.unlockedBadgeIds, ...newBadgeIds],
  };
  return { next, xpGained: quest.xp, newBadgeIds };
}

/** Builds the last 14 days as {date, moodColor|null} for the heatmap. */
export function lastTwoWeeks(history: CheckInRecord[]): { date: string; color: string | null }[] {
  const byDate = new Map(history.map((h) => [h.date, h.result.mood_color]));
  const days: { date: string; color: string | null }[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, color: byDate.get(iso) ?? null });
  }
  return days;
}
