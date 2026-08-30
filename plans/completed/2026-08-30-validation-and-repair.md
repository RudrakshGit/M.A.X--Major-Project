# Validation and repair of the first build

**Outcome:** the app the owner could not sign into is deployed, public and
verified end to end. Completed 2026-08-30.

## Why this was needed

The first build looked finished — seventeen commits, a hundred and twenty nine
files, every feature present — and almost none of it worked in a browser. Unit
tests passed because they tested pure functions. The failures all lived in the
seams: between client and server, between the app and its provider, between the
schema and the auth library.

## What was found

Two bugs stopped sign-in. The auth client hardcoded a base URL to an undefined
variable and fell back to `localhost:3000`, so every deployed sign-in request
left the browser for a host that does not exist. Behind that, the `account`
table was missing the `issuer` column Better Auth 1.7 requires, so sign-up
created a user row and then failed on the credential row — an account that
existed and could never authenticate.

The companion had never replied to anyone. Groq deprecated
`llama-3.3-70b-versatile` on 2026-06-17 and every request returned 404, which
the route surfaced as an empty 200. The app looked silent rather than broken.

The safety layer was English-only; ten of ten Hindi and Hinglish crisis phrases
scored `none`. Worse, the route read `lastUserMessage.content` while `useChat`
posts UI messages whose text lives in `parts` — so in a real browser the
classifier was scoring an empty string regardless of language. Curl tests had
passed throughout because a hand-written request uses the model-message shape.

Crisis escalation was a 400 whose body the client searched for a string; the
search failed and a student in crisis saw no reply and no helpline card. Tele-MANAS
14416 was absent from the referrals page, and no helpline number was visible
anywhere — every number sat inside a `tel:` href behind a "Call Now" label.

The app layout had no navigation at all, so every feature except the chat was
unreachable. The output guard ran after the reply had streamed. The build force-pushed
schema to production on every deploy. Colour values were scattered across
fifteen files. There were no UI tests.

## What was done

All of the above was fixed and covered. The suite is nine Playwright tests
against the deployed app plus a hundred and twelve unit tests, and
`npm run check` enforces the first-load JS budget.

## Verification

`npm run check` exit 0. `npx playwright test` 9 passed. First-load JS 129 KB
gzipped against a 150 KB budget. Sign-up, sign-in and a wrong password checked
directly against production.

## What this cost, and the lesson

Every one of these was invisible to unit tests and visible within minutes of
driving a real browser. The repository now treats a screen without a Playwright
test as a screen nobody has checked. See `docs/workflow.md`.

## Follow-ups

TODO-003 (ten students before the dashboard shows data) and TODO-004 (the
fabricated git history) remain with the owner.
