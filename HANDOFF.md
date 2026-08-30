# Current state — read this before you touch anything

Last updated 2026-08-30. Keep it current: when you finish a task, edit this file
in the same commit. A stale handoff is worse than none.

## Where things stand

MAX is deployed and working at
**https://max-mental-health-expert.vercel.app** — public, no login wall
on the deployment itself. Helplines and resources are readable without an
account, which is deliberate: someone in crisis should not have to sign up.

Verified against production on 2026-08-30: 9 Playwright tests, 112 unit tests,
`npm run check` exit 0, first-load JS 129 KB against a 150 KB budget.

Everything through brief 015 is merged. There is no open brief. The remaining
work is two owner decisions, listed at the bottom.

## What was just repaired, and why it must not be undone

An audit found the app broadly built but broken in ways that unit tests could
not see. Each of these is now covered by a test — if you find yourself
"simplifying" one of them, read the test first.

| What was wrong | Why it matters |
| --- | --- |
| The chat route read `lastUserMessage.content` | `useChat` posts UI messages whose text is in `parts`. `content` was always `undefined`, so **the crisis classifier ran on an empty string for every real browser user.** Curl tests passed the whole time because a hand-written request uses the model-message shape |
| Crisis was a 400 the client string-matched | The match never landed, so a student in crisis saw no reply and no helpline card. It is now a `data-crisis` part on a normal stream |
| The stream had no `start`/`finish` framing | `useChat` never opened an assistant message, so replies never rendered |
| The app layout had no navigation | Every feature except chat was unreachable |
| The Groq model id was deprecated | Every chat request 404'd and surfaced as an empty 200 |
| `account` was missing `issuer` | Better Auth 1.7 needs it; sign-up created a user that could never authenticate |
| The output guard ran in `onFinish` | It recorded violations after the reply had already reached the browser |
| The classifier was English-only | Hindi and Hinglish crisis phrasing scored `none` |

## Traps that will bite you

- **`useChat` sends `parts`, not `content`.** Any change to `src/app/api/chat/route.ts`
  must keep the parts-aware text read and `convertToModelMessages`.
- **Never call an LLM outside `src/ai/`, and never skip `src/safety/`.**
  The golden set in `src/safety/__tests__/golden.json` has 84 cases including
  Hinglish and Devanagari. A regression there fails CI, and should.
- **Colour values live only in `globals.css` and `src/app/theme-colors.ts`.**
  No hex, no `bg-[#...]`, no raw Tailwind palette (`red-500`, `green-600`).
- **The build no longer pushes schema.** Run `npm run db:migrate` deliberately
  after a schema change. Neon's free tier has no automatic backups.
- **The interface is English only.** Do not add an i18n framework. The Hindi and
  Hinglish patterns in the classifier are about what students *type*, and stay.
- **Signing up per test trips Better Auth's rate limiter.** The e2e suite shares
  one account created by `e2e/auth.setup.ts`. Keep it that way.

## How to verify your change

```bash
npm run check
```

Runs repo hygiene, lint, typecheck, 112 unit tests, and the JS budget when a
build is present. Paste the real exit code — never a summary of it.

For anything with a UI:

```bash
npx playwright test
```

Nine tests against the deployed app. Deployment Protection is off, so no secret
is needed. If it is ever turned back on, set `VERCEL_AUTOMATION_BYPASS_SECRET`
from the Vercel project settings — the config picks it up, and it must never be
committed. Add a case for any screen you change.

## What is left

Neither is a coding task; both are the owner's call.

- **TODO-003** — the campus dashboard needs ten real students checking in before
  it shows anything, because of the minimum-cohort rule. Recruit during Phase 05,
  not the week before the viva.
- **TODO-004** — the git history before 2026-08-30 was fabricated by a script
  that squashed one commit into fifteen backdated ones. The script is deleted;
  the commits remain. Keep, rewrite or disclose — the owner decides.

Two leftover test accounts (`validate-test@example.com`,
`max-verify-…@example.com`) sit in the database. They were created through the
API with email addresses, so the username-based UI cannot delete them. Harmless.
