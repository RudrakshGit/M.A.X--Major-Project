# 008 — Mood Check-ins & Journaling

- **Status:** merged
- **Phase:** PH-03
- **Branch:** `feat/mood-journal`
- **Read before starting:** `project/state.json`

## Outcome

The student can log their current mood using a 5-point scale and optionally write a journal entry. A timeline of their past entries is displayed to help them notice trends in their well-being.

## Files

| File | Action |
| --- | --- |
| `src/features/journal/actions.ts` | create |
| `src/features/journal/components/mood-logger.tsx` | create |
| `src/features/journal/components/journal-history.tsx` | create |
| `src/app/(app)/journal/page.tsx` | create |

## Context
- **Mood Scale**: Terrible, Bad, Okay, Good, Great.
- Database table `journalEntry` has `mood` (string), `content` (optional string), `createdAt`.

## Steps

1. **Database Actions (`src/features/journal/actions.ts`)**:
   - `saveJournalEntry(mood: string, content?: string)`: Inserts a row into `journalEntry`.
   - `getJournalHistory()`: Fetches all entries for the user, ordered by `createdAt` descending.
2. **UI Components (`src/features/journal/components/*`)**:
   - `MoodLogger`: Client component. Renders the 5 emojis/buttons. Provides an optional `<textarea>` for notes. Submits via server action.
   - `JournalHistory`: Renders a list/timeline of past entries. Shows date (formatted), mood, and notes.
3. **App Route (`src/app/(app)/journal/page.tsx`)**:
   - Fetches history via `getJournalHistory()`.
   - Renders `MoodLogger` and then `JournalHistory`.

## Acceptance

- [ ] Submitting a mood instantly reflects in the timeline.
- [ ] No required text for a mood check-in.
- [ ] `npm run check` passes.

## Verify

```bash
npm run check
```
