# How a task gets done

The same loop for a human and for an agent.

## The loop

1. **Take a brief** from `briefs/`. It names the files, the schema, the
   acceptance criteria and the verify command. If it does not, it is not ready
   — ask, do not improvise.
2. **Branch.** `git switch -c <type>/<short-name>` off an up-to-date `main`.
3. **Read narrowly.** The brief plus at most one `docs/` page. Search before
   opening. Do not read the whole repository to make a small change.
4. **Schema first.** Zod contract, then the Server Action, then the UI.
5. **Build only what the brief asks.** Something else broken? Note it in the PR;
   do not fix it in this branch.
6. **Verify.** `npm run check`. Paste the **real exit code**. A summary is not
   evidence. If it fails, fix it — never weaken a test to make it pass.
7. **Prove the UI** when you changed one: a headless Playwright screenshot into
   `evidence/`. The in-app browser pane runs hidden and lies about computed
   styles.
8. **PR.** Conventional Commit title, one concern, the template filled in.
9. **Update state** only if a phase gate or a durable decision moved.

## For agents specifically

- One brief at a time. Do not batch two briefs into one branch.
- Do not create files the brief did not ask for — no extra README, no
  `utils/`, no speculative abstraction.
- Do not touch `src/safety/` unless the brief is a safety brief.
- Wrap noisy commands: `npm run bounded -- <label> <command>`. The full output
  goes to an ignored file; you get status plus a short tail.
- Stuck twice on the same error? Stop and report. Do not try a third approach
  that rewrites unrelated code.

## For whoever writes the briefs

A brief that a small model can execute states:

- the outcome in one sentence;
- the exact files to create or change;
- the Zod schema, written out in full;
- acceptance criteria that are checkable, not vibes;
- the verify command;
- explicitly, what **not** to touch.

If a brief needs judgement, it is not a brief yet. Split it or decide first.
Use `briefs/TEMPLATE.md`.

## Plans

Only for work spanning several sessions. `plans/active/<date>-<slug>.md` with
outcome, scope, risks, steps, acceptance and status. When acceptance passes,
add the verification and move it to `plans/completed/`. Do not keep a diary.
