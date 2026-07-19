import type { WellnessState } from "../types";

const STORAGE_KEY = "dwc:state:v1";

const DEFAULT_STATE: WellnessState = {
  name: "Friend",
  xp: 0,
  level: 1,
  streak: 0,
  lastCheckInDate: null,
  history: [],
  completedQuestsToday: [],
  unlockedBadgeIds: [],
};

/**
 * Storage adapter interface. Swap `localStorageAdapter` for a fetch-based
 * adapter hitting a real backend/database later without touching callers.
 */
export interface StateAdapter {
  load(): WellnessState;
  save(state: WellnessState): void;
}

export const localStorageAdapter: StateAdapter = {
  load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw) as WellnessState;
      // Defensive merge in case older shapes exist in a user's browser.
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return { ...DEFAULT_STATE };
    }
  },
  save(state: WellnessState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage can throw in private-browsing / quota-exceeded cases.
      // Failing silently is acceptable here; the app still works in-memory.
    }
  },
};

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}
