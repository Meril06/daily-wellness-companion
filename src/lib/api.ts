import type { CheckInInput, CheckInResult } from "../types";

export async function submitCheckIn(input: CheckInInput): Promise<CheckInResult> {
  const res = await fetch("/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Check-in request failed: ${res.status}`);
  }

  const data = (await res.json()) as CheckInResult;
  return data;
}
