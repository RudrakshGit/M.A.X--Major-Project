# 009 — Resource Library

- **Status:** merged
- **Phase:** PH-03
- **Branch:** `feat/resource-library`
- **Read before starting:** `project/state.json`

## Outcome

The student has access to a structured psycho-education library covering the 6 required conditions. Each condition provides clear signs, actionable coping strategies, and crisis escalation advice, adhering to the non-clinical supportive tone of MAX.

## Files

| File | Action |
| --- | --- |
| `src/content/resources.ts` | create |
| `src/features/resources/components/resource-card.tsx` | create |
| `src/features/resources/components/resource-content.tsx` | create |
| `src/app/(app)/resources/page.tsx` | create |
| `src/app/(app)/resources/[topic]/page.tsx` | create |
| `project/state.json` | modify |

## Context
- Required conditions: Depression, Anxiety, Burnout, Stress, Sleep Issues, Relationship Issues.

## Steps

1. **Content Hub (`src/content/resources.ts`)**:
   - Create a static, type-safe data structure containing educational content for the 6 target conditions.
2. **UI Components (`src/features/resources/components/*`)**:
   - `ResourceCard`: Simple display card for the index page.
   - `ResourceContent`: Renders the detailed text, signs, strategies, and crisis blocks cleanly.
3. **App Routes**:
   - `/resources`: Renders the 6 topics as cards.
   - `/resources/[topic]`: Dynamic route rendering the specific condition.
4. **State Update**:
   - Update `project/state.json` to mark Phase 03 as done and Phase 04 as current.

## Acceptance

- [ ] All 6 conditions are present.
- [ ] No clinical diagnoses are issued.
- [ ] `npm run check` passes.

## Verify

```bash
npm run check
```
