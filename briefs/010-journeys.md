# 010 — Structured Self-help Journeys

- **Status:** ready
- **Phase:** PH-04
- **Branch:** `feat/journeys`
- **Read before starting:** `project/state.json`

## Outcome

Students can enroll in multi-day self-help journeys covering the 6 core conditions. They track their progress day-by-day and complete actionable tasks. 

## Files

| File | Action |
| --- | --- |
| `src/content/journeys.ts` | create |
| `src/features/journeys/actions.ts` | create |
| `src/features/journeys/components/journey-card.tsx` | create |
| `src/features/journeys/components/journey-day-view.tsx` | create |
| `src/app/(app)/journeys/page.tsx` | create |
| `src/app/(app)/journeys/[id]/page.tsx` | create |

## Context
- Required conditions: Depression, Anxiety, Burnout, Stress, Sleep Issues, Relationship Issues.
- 5 days per journey.
- Use `journeyEnrolment` and `journeyStep` DB tables.

## Steps

1. **Content Hub (`src/content/journeys.ts`)**:
   - Create 6 journeys with 5 days of content and action items each.
2. **Server Actions (`src/features/journeys/actions.ts`)**:
   - `enrollInJourney`, `completeJourneyDay`, `getUserJourneys`.
3. **UI Components (`src/features/journeys/components/*`)**:
   - `JourneyCard`: Visual display of journey in catalog.
   - `JourneyDayView`: Displays content for a specific day and a "Complete" button.
4. **App Routes**:
   - `/journeys`: Catalog of all journeys, displaying enrolled ones at the top.
   - `/journeys/[id]`: Detail view of the journey, progress timeline, and the active day view.

## Acceptance

- [ ] All 6 journeys have 5 days.
- [ ] Users can enroll and progress day-by-day.
- [ ] `npm run check` passes.

## Verify

```bash
npm run check
```
