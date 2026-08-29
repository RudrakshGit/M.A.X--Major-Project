# MAX — Mental-health Access & eXpression

A stigma-free mental health support system for students in higher education.

**Major project E-G18** · Guide: Mr. Devendra Kuril
Prayagi Sahajwani · Sanskriti Kachole · Raja Jain · Rudraksh Mishra

> Indian colleges now carry a legal duty to provide mental health support that
> most rural and semi-urban campuses cannot staff. MAX is the digital
> instrument that fills the gap between "a counsellor is mandated" and
> "a counsellor exists".

## What it does

A companion the student names and talks to at any hour, wrapped in a safety
layer that never lets a model handle a crisis alone. Around it: mood check-ins,
public-domain screeners, a resource library and short guided journeys across
the six conditions in our problem statement — anxiety, depression, burnout,
sleep, academic stress and social isolation. Behind it: a referral directory,
and an anonymous aggregate dashboard for the institution that can never
identify a student.

Built for a budget Android on a 4G tower.

**Live:** https://max-rudrakshm099-7145s-projects.vercel.app

## Start here

| You are | Read |
| --- | --- |
| An agent picking up a task | [`HANDOFF.md`](HANDOFF.md), then [`AGENTS.md`](AGENTS.md) |
| A teammate joining | [`docs/product.md`](docs/product.md) then [`docs/architecture.md`](docs/architecture.md) |
| Writing the report | [`docs/research.md`](docs/research.md) — every citation lives there |
| Touching anything near the model | [`docs/safety.md`](docs/safety.md), all of it |

## Commands

```bash
npm run check
```

Runs repo hygiene, and lint, typecheck and tests once the app exists. Always
report its real exit code — never a summary of it.

```bash
npm run bounded -- <label> <command>
```

Wraps a noisy command so the full output goes to an ignored log and you see
only status plus a short tail.

## Stack

Next.js · Tailwind · shadcn/ui · Drizzle · Neon Postgres · Better Auth ·
Vercel AI SDK on Groq · Playwright · Vercel Hobby (`bom1`).

Every tier is free and needs no credit card.

## The rules that matter most

1. Safety is code in `src/safety/`, never prompt text. No model call bypasses it.
2. No diagnosis, no medication advice, no crisis counselling from the AI.
3. An institution sees aggregates only, with a minimum cohort size.
4. No personal data ever reaches a model provider.
5. The interface is English, but the safety classifier must still read Hinglish.
