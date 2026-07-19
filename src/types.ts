export type Mood = "great" | "okay" | "low" | "stressed";

export type MoodColor = "green" | "blue" | "amber" | "coral";

export interface CheckInInput {
  mood: Mood;
  sleepHours: number;
  energyLevel: number; // 1-10
  note?: string;
}

export interface CheckInResult {
  title: string;
  message: string;
  suggestions: string[];
  mood_color: MoodColor;
}

export interface CheckInRecord extends CheckInInput {
  date: string; // YYYY-MM-DD
  result: CheckInResult;
}

export type QuestId = "checkin" | "breathing" | "sleep";

export interface Quest {
  id: QuestId;
  label: string;
  xp: number;
}

export interface BadgeDef {
  id: string;
  label: string;
  description: string;
  // A badge unlocks once its `test` predicate is true, given the user's stored state.
}

export interface WellnessState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastCheckInDate: string | null;
  history: CheckInRecord[];
  completedQuestsToday: QuestId[];
  unlockedBadgeIds: string[];
}
