# 015 — Make the output guard actually block, and enforce the bundle budget

- **Status:** merged
- **Phase:** PH-02
- **Branch:** `fix/output-guard`
- **Read before starting:** `docs/safety.md`

## Outcome

A reply that fails the output guard is replaced before the student sees it, and
`npm run check` fails when first-load JS exceeds the budget.

## Problem 1 — the guard does not guard

`src/app/api/chat/route.ts` calls `guardOutput(text)` inside `onFinish`, which
runs *after* the reply has streamed to the browser. A violating reply is
recorded and still delivered. `docs/safety.md` requires it to be replaced by a
reviewed fallback.

This is a genuine trade-off and the owner should pick:

- **Buffer** — collect the full reply, guard it, then send. Guaranteed blocking,
  but time-to-first-token becomes time-to-full-reply, which `docs/performance.md`
  budgets at 1.5 s on a 4G tower.
- **Stream with a late interrupt** — stream, and if the guard trips, stop the
  stream and replace the visible message client-side. Keeps the fast feel; the
  student may glimpse a few words first.

Default to **buffer** unless the owner says otherwise. Correctness before speed
in the safety path, and replies are short by design.

## Problem 2 — the budget is documented but not enforced

`docs/performance.md` states that `npm run check` fails the build when
first-load JS exceeds 150 KB gzipped. It does not — no such check exists. Either
implement it or correct the document; do not leave the claim standing.

## Files

| File | Action |
| --- | --- |
| `src/app/api/chat/route.ts` | guard before delivery |
| `src/safety/guard.ts` | export a reviewed fallback message |
| `src/safety/__tests__/guard.test.ts` | create — cases per rule in safety.md |
| `scripts/check.mjs` | add the first-load JS budget check |

## Acceptance

- [ ] A reply containing a diagnosis verdict never reaches the client
- [ ] A blocked reply is replaced by the reviewed fallback, not an empty bubble
- [ ] `guard.test.ts` covers every rule listed in `docs/safety.md`
- [ ] `npm run check` fails when first-load JS exceeds 150 KB gzipped
- [ ] No message content appears in any log line
- [ ] `npm run check` exits 0 on a clean tree

## Do not touch

`src/safety/classifier.ts` and its golden set. Input classification is verified
and working in production; this brief is about output only.
