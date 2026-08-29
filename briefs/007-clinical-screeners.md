# 007 — Clinical Screeners

- **Status:** merged
- **Phase:** PH-03
- **Branch:** `feat/clinical-screeners`
- **Read before starting:** `project/state.json`

## Outcome

The student can self-assess their mental health using standardized instruments (PHQ-9 for Depression, GAD-7 for Anxiety, and CBI for Burnout). The results are saved to their profile and banded into clinical severity levels (Mild, Moderate, Severe, etc.) without diagnosing them.

## Files

| File | Action |
| --- | --- |
| `src/content/screeners.ts` | create |
| `src/features/assessments/__tests__/scoring.test.ts` | create |
| `src/features/assessments/actions.ts` | create |
| `src/features/assessments/components/screener-form.tsx` | create |
| `src/app/(app)/assessments/[instrument]/page.tsx` | create |

## Context
- **PHQ-9**: 9 questions, scored 0-27. Bands: 0-4 (None-minimal), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately Severe), 20-27 (Severe).
- **GAD-7**: 7 questions, scored 0-21. Bands: 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15-21 (Severe).
- **CBI**: 13 questions (combining Personal & Studies-related burnout for this context), scored as averages or sums out of 100 per question, usually banded in quartiles. For this brief, score each question 0-100, calculate the mean. Bands: 0-24 (Low), 25-49 (Moderate), 50-74 (High), 75-100 (Severe).

## Steps

1. **Content & Logic (`src/content/screeners.ts`)**:
   - Define data structures for instruments: id, title, description, questions (id, text), options (text, score).
   - Export pure functions `scorePHQ9`, `scoreGAD7`, `scoreCBI` that take an array of numbers and return `{ total: number, band: string }`.
2. **Tests (`src/features/assessments/__tests__/scoring.test.ts`)**:
   - Write unit tests proving that specific response vectors map strictly to the correct band.
3. **Database Actions (`src/features/assessments/actions.ts`)**:
   - `submitScreenerRun(instrument, responses, totalScore, band)`: Inserts a row into `screenerRun`.
4. **UI Components (`src/features/assessments/components/screener-form.tsx`)**:
   - A client component rendering a clean form. Uses Tailwind tokens.
   - Calculates the score client-side and submits via server action.
   - On complete, shows a supportive summary screen with the band.
5. **App Route (`src/app/(app)/assessments/[instrument]/page.tsx`)**:
   - Dynamic route that pulls the instrument data and renders the `ScreenerForm`.

## Acceptance

- [ ] Golden tests pass for all three instruments.
- [ ] No clinical diagnoses are displayed (only bands like "Moderate").
- [ ] `npm run check` passes.

## Verify

```bash
npm run check
```
