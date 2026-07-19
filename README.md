# Daily Wellness Companion

A gamified daily check-in app for students. Students log mood, sleep, and
energy; Claude turns that into a short, warm, personalized response. XP,
streaks, quests, and badges live in the browser via `localStorage`.

## Stack

- React + Vite + TypeScript
- Tailwind CSS + Framer Motion
- Vercel Functions (Node) backend that calls the Claude API server-side
- `localStorage` for all gamification state (structured so it can swap to a
  real database later — see `src/lib/storage.ts`)

## 1. Install

```bash
npm install
```

## 2. Set your API key

```bash
cp .env.example .env
```

Edit `.env` and set `GEMINI_API_KEY` to a real key from
https://aistudio.google.com/apikey (free, no credit card required). The key
is only ever read on the server (`api/checkin.ts`) — it is never sent to or
bundled into the frontend.

## 3. Run locally

The `/api` route only exists as a real serverless function under Vercel's
dev server, so use the Vercel CLI for full local parity:

```bash
npm install -g vercel   # one-time
vercel dev
```

This serves both the Vite frontend and `api/checkin.ts` together, typically
at `http://localhost:3000`.

Alternatively, `npm run dev` runs plain Vite (faster reloads for pure UI
work), but `/api/checkin` calls will fail unless you also run `vercel dev`
separately and let the Vite proxy in `vite.config.ts` forward to it.

## 4. Build order this project follows

1. Scaffold (Vite + React + Tailwind + Framer Motion) — done, see config files.
2. Check-in screen UI (`src/screens/CheckIn.tsx`) with mood/slider animation.
3. Backend function + strict-JSON Claude prompt (`api/checkin.ts`).
4. Result screen (`src/screens/Result.tsx`), wired to the real API response.
5. Gamified Home screen (`src/screens/Home.tsx`) + `localStorage` XP/streak/
   badge logic (`src/lib/gamification.ts`, `src/lib/storage.ts`).
6. Page transitions between Home ↔ Check-in ↔ Result (`src/App.tsx`,
   `AnimatePresence`).
7. Polish: background beams, shimmer button, confetti bursts, badge glow.
8. Deploy (below).

## 5. Deploy to Vercel

```bash
npm install -g vercel   # if you haven't
vercel
```

Then in the Vercel project dashboard, add `ANTHROPIC_API_KEY` (and
optionally `ANTHROPIC_MODEL`) under **Settings → Environment Variables**,
and redeploy. Vercel auto-detects the Vite frontend and the `api/` function.

## Notes

- **Model string:** `api/checkin.ts` defaults to `gemini-2.5-flash` and
  reads `GEMINI_MODEL` as an override. Check
  [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
  for which models are currently free-tier eligible before you ship, since
  this changes over time.
- **Free tier limits:** Google's free tier is generous but rate-limited
  (requests per minute/day). Fine for a demo or hackathon; if you hit a 429
  error, wait a minute and try again, or check your live limits in
  [Google AI Studio](https://aistudio.google.com/).
- **Safety:** the app shows a permanent disclaimer ("This is not medical
  advice…") on the check-in results, and the backend prompt explicitly asks
  the model to encourage reaching out to a real person if a note suggests
  serious distress, rather than trying to resolve it itself. This is a
  supportive tool, not a crisis service — if you or a user of this app is in
  crisis, direct them to a real hotline or emergency services.
- **No database yet:** all gamification state is in `localStorage`
  (`src/lib/storage.ts`), behind a small `StateAdapter` interface so it's
  straightforward to swap in a real backend later without touching the
  screens.
