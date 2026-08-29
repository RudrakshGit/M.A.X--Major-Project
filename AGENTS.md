# MAX — agent operating guide

MAX (Mental-health Access & eXpression) is a stigma-free mental health support
system for students in higher education. Major project E-G18.

Read this file, then **one** `docs/` page for your task. Do not preload `docs/`.

## Start here

1. Your task comes from a brief in `briefs/`. It names the files, the schema and
   the acceptance check. Follow it; do not widen the scope.
2. Current phase and queue: `project/state.json`. Read it only when planning.
3. Route to detail with `docs/index.md`.
4. Finish with `npm run check`. Paste the real exit code, never a summary.

## Invariants — these break the product if violated

- **Safety is not a prompt.** Every model reply passes through
  `src/safety/`. Never call an LLM from a route or component directly.
- **No diagnosis, no medication, no crisis counselling** from the AI. Screeners
  report bands, never a condition name as a verdict.
- **An institution never sees an individual.** Campus queries return aggregates
  with a minimum cohort size. No user id leaves that boundary.
- **No PII to any model.** No name, email, roll number, college. Strip at the
  provider boundary, not in the prompt.
- **Secrets stay in `.env.local`.** Only names go in `.env.example`.
- Never delete or rewrite another track's files to make your check pass.

## Map

- `src/app/` routes · `src/features/<domain>/` owned UI + actions
- `src/safety/` risk classification, output guard, escalation
- `src/db/` Drizzle schema and queries · `src/content/` journeys and resources
- `docs/` one topic per page · `briefs/` your task · `plans/active/` multi-day work

## Rules of the house

- Server Components by default. A client island needs a reason in the PR.
- Zod schema first, then the Server Action, then the UI. Never the reverse.
- Tailwind tokens only — no hex values, no arbitrary radii, no new palette.
- UI proof is headless Playwright. The in-app browser pane is unreliable here.
- Conventional Commits. One PR owns one concern.
- Hindi and English ship together. A string without a translation key is a bug.
