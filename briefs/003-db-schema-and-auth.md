# 003 — Database Schema & Better Auth on Neon

- **Status:** merged
- **Phase:** PH-01
- **Branch:** `feat/db-auth`
- **Read before starting:** `docs/data-model.md`, `docs/architecture.md`

## Outcome

Establish the Drizzle ORM PostgreSQL schema for all core tables on Neon and configure self-hosted Better Auth with pseudonymous user profiles.

## Files

| File | Action |
| --- | --- |
| `drizzle.config.ts` | create |
| `src/db/schema.ts` | create |
| `src/db/index.ts` | create |
| `src/lib/auth.ts` | create |
| `src/app/api/auth/[...all]/route.ts` | create |

## Contract

```ts
import { z } from "zod";

export const UserRoleSchema = z.enum(["student", "institution_viewer"]);
export const LocaleSchema = z.enum(["en"]);
export const RiskLevelSchema = z.enum(["none", "distress", "crisis"]);
export const ScreenerInstrumentSchema = z.enum(["phq9", "gad7", "cbi"]);
```

## Steps

1. **Drizzle Config:** Create `drizzle.config.ts` specifying PostgreSQL dialect, schema path (`src/db/schema.ts`), and output migrations directory (`src/db/migrations`).
2. **Author Database Schema:** Create `src/db/schema.ts` defining:
   - Better Auth tables: `user`, `session`, `account`, `verification`.
   - Domain tables: `consent`, `companion`, `conversation`, `message`, `memorySummary`, `moodCheckIn`, `screenerRun`, `journalEntry`, `journeyEnrolment`, `journeyStep`, `safetyEvent`, `institution`.
   - Enforce privacy invariants: `safetyEvent` has no message text and no student user foreign key.
3. **Initialize Database Client:** Create `src/db/index.ts` connecting via `@neondatabase/serverless` using `drizzle-orm/neon-http`.
4. **Configure Better Auth:** Create `src/lib/auth.ts` connecting Better Auth to Drizzle using `better-auth/adapters/drizzle`.
5. **Auth Route Handler:** Create `src/app/api/auth/[...all]/route.ts` exporting GET and POST route handlers via `toNextJsHandler(auth.handler)`.

## Acceptance

- [ ] All 16 database tables are defined with strict types in `src/db/schema.ts`.
- [ ] Better Auth config uses the Drizzle adapter and compiles without TypeScript errors.
- [ ] Privacy boundaries respected (no PII in safety events or model queries).
- [ ] `npm run check` passes with exit code 0.

## Verify

```bash
npm run check
```

## Do not touch

- `src/safety/` (covered in Brief 002)
- Tailwind configuration or layout files
