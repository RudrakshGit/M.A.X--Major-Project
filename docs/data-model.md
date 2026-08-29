# Data model

Drizzle schema in `src/db/schema.ts` is authoritative. This page explains
intent and the one boundary that must never leak.

## Tables

| Table | Holds | Notes |
| --- | --- | --- |
| `user` | auth identity, `displayName`, `locale`, `institutionId` | Better Auth owns the auth columns |
| `consent` | version, granted timestamp, withdrawn timestamp | Append-only. Never update a row in place |
| `companion` | name, tone, avatar seed | The student renames MAX here |
| `conversation` | one chat thread | |
| `message` | role, content, `riskLevel`, timestamps | `riskLevel` is written by `src/safety/` |
| `memorySummary` | rolling summary per user | Replaces old turns; see [`ai.md`](ai.md) |
| `moodCheckIn` | score, optional note, timestamp | One per day, editable same day |
| `screenerRun` | instrument, item responses, total, band | `phq9`, `gad7`, `cbi`, plus our own check-ins |
| `journalEntry` | body, optional prompt id, timestamp | |
| `journeyEnrolment` | journey id, current day, started, completed | |
| `journeyStep` | per-day completion | |
| `safetyEvent` | risk level, trigger layer, action taken | **No message content.** Reason codes only |
| `institution` | name, type, counsellor contact | Seeded, not user-created |

## The privacy boundary

The institution role has **no query path to an individual student**. This is
enforced in three places, not one:

1. A separate query module, `src/features/campus/queries.ts`, is the only code
   an institution route may call. It returns aggregates and nothing else.
2. Every aggregate applies a **minimum cohort size of 10**. Below that, the
   query returns "not enough data", never a number. This defeats the obvious
   re-identification attack on a small department.
3. No aggregate is ever sliced finely enough to isolate a person — no
   combination of course, year and gender that narrows to a handful.

If a task seems to need per-student institutional access, it is out of scope.
Stop and ask the owner.

## What never reaches a model provider

Name, email, roll number, institution, and any free text from the `user` or
`institution` tables. Stripping happens in `src/ai/`, at the provider boundary.
Doing it inside a prompt template is not stripping — a later edit will undo it.

## Retention and deletion

- Export: `GET /api/export` returns everything we hold as JSON — conversations
  and messages included, not just journals and check-ins. If you add a table
  that holds student data, add it there in the same change.
- Delete: a hard delete of the user's rows, not a soft flag. `safetyEvent`
  rows are anonymised rather than kept — they carry no content anyway.
- No analytics vendor, no third-party session recording, no advertising SDK.

## Migrations

Drizzle Kit, checked into `src/db/migrations/`. Forward-only. On the free tier
there are no automatic backups, so before any destructive migration take a
manual dump and say so in the PR.
