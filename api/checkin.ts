import type { VercelRequest, VercelResponse } from "@vercel/node";

// The API key lives only in the server environment (Vercel project env vars).
// It is never sent to or readable by the client.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Update this if Google renames/retires the model. "gemini-2.5-flash" is a
// stable, free-tier-eligible model as of writing — check
// https://ai.google.dev/gemini-api/docs/models for the current list.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

type Mood = "great" | "okay" | "low" | "stressed";

interface CheckInBody {
  mood: Mood;
  sleepHours: number;
  energyLevel: number;
  note?: string;
}

interface AiJsonResult {
  title: string;
  message: string;
  suggestions: string[];
  mood_color: "green" | "blue" | "amber" | "coral";
}

const MOOD_LABEL: Record<Mood, string> = {
  great: "Great",
  okay: "Okay",
  low: "Low",
  stressed: "Stressed",
};

function buildPrompt(body: CheckInBody): string {
  const noteBlock = body.note?.trim()
    ? `They also added this note: "${sanitizeNote(body.note)}"`
    : "They did not add an additional note.";

  return `You are a warm, encouraging wellness check-in companion inside a gamified app for students. A student just completed their daily check-in with this data:

- Mood: ${MOOD_LABEL[body.mood]}
- Sleep last night: ${body.sleepHours} hours
- Energy level (1-10): ${body.energyLevel}
${noteBlock}

Write a short, personal, warm response. Do not use a clinical or therapist-like tone — talk like a supportive friend who happens to be thoughtful about wellbeing. Keep it encouraging but genuine; do not minimize low mood or high stress.

If anything in the note suggests serious distress, self-harm, or crisis, respond supportively but gently and clearly encourage the student to reach out to a real person — a counselor, doctor, trusted adult, or a crisis line — rather than trying to resolve it yourself. Do not attempt to diagnose or provide clinical/medical guidance.

Respond with STRICT JSON ONLY. No markdown fences, no preamble, no trailing commentary — just a single JSON object matching exactly this shape:

{
  "title": "5-7 word summary of how they're doing",
  "message": "2 warm, supportive sentences, no clinical tone",
  "suggestions": ["short action 1", "short action 2", "short action 3"],
  "mood_color": "green | blue | amber | coral"
}

Choose mood_color based on their overall state (green = doing well, blue = steady/okay, amber = a bit low or tired, coral = stressed or struggling).`;
}

function sanitizeNote(note: string): string {
  // Strip quote characters so the note can't break out of the prompt's
  // quoted block, and cap length defensively.
  return note.replace(/["\\]/g, "").slice(0, 500);
}

function isValidResult(x: unknown): x is AiJsonResult {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.title === "string" &&
    typeof r.message === "string" &&
    Array.isArray(r.suggestions) &&
    r.suggestions.every((s) => typeof s === "string") &&
    typeof r.mood_color === "string" &&
    ["green", "blue", "amber", "coral"].includes(r.mood_color as string)
  );
}

function fallbackResult(body: CheckInBody): AiJsonResult {
  const colorByMood: Record<Mood, AiJsonResult["mood_color"]> = {
    great: "green",
    okay: "blue",
    low: "amber",
    stressed: "coral",
  };
  return {
    title: "Thanks for checking in today",
    message:
      "We couldn't reach your personalized feedback just now, but showing up to check in on yourself is what matters most. Be gentle with yourself today.",
    suggestions: [
      "Take a few slow breaths",
      "Drink a glass of water",
      "Step outside for a minute",
    ],
    mood_color: colorByMood[body.mood],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body as Partial<CheckInBody>;

  if (
    !body ||
    !["great", "okay", "low", "stressed"].includes(body.mood as string) ||
    typeof body.sleepHours !== "number" ||
    typeof body.energyLevel !== "number"
  ) {
    res.status(400).json({ error: "Invalid check-in payload" });
    return;
  }

  const safeBody: CheckInBody = {
    mood: body.mood as Mood,
    sleepHours: clamp(body.sleepHours, 0, 14),
    energyLevel: clamp(body.energyLevel, 1, 10),
    note: typeof body.note === "string" ? body.note : undefined,
  };

  if (!GEMINI_API_KEY) {
    // No key configured (e.g. local dev without env vars) — degrade gracefully
    // instead of breaking the demo.
    res.status(200).json(fallbackResult(safeBody));
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(safeBody) }],
            },
          ],
          generationConfig: {
            // Ask Gemini to guarantee JSON-shaped output rather than relying
            // purely on prompt instructions.
            responseMimeType: "application/json",
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      res.status(200).json(fallbackResult(safeBody));
      return;
    }

    const data = await response.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      // Defensive: strip accidental markdown fences if the model adds them.
      const cleaned = rawText.replace(/^```json\s*|```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse Gemini JSON response:", rawText);
      res.status(200).json(fallbackResult(safeBody));
      return;
    }

    if (!isValidResult(parsed)) {
      console.error("Gemini response did not match expected shape:", parsed);
      res.status(200).json(fallbackResult(safeBody));
      return;
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Unexpected error calling Gemini API:", err);
    res.status(200).json(fallbackResult(safeBody));
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
