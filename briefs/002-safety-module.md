# 002 — Stand up the safety module and its golden test set

- **Status:** ready
- **Phase:** PH-02
- **Branch:** `feat/safety-module`
- **Read before starting:** `docs/safety.md`

## Outcome

A robust deterministic safety classifier and an automated 40-case golden test set for English text, ensuring we never miss a crisis case and setting the foundation for model wiring.

## Files

| File | Action |
| --- | --- |
| `src/safety/__tests__/golden.json` | create |
| `src/safety/classifier.ts` | create |
| `src/safety/__tests__/classifier.test.ts` | create |

## Contract

```ts
import { z } from "zod";

export const RiskLevelSchema = z.enum(["none", "distress", "crisis"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ClassificationResultSchema = z.object({
  level: RiskLevelSchema,
  reason: z.string().optional(),
  deterministic: z.boolean()
});
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;
```

## Steps

1. **Author the Golden Set:** Create `src/safety/__tests__/golden.json` containing an array of at least 40 labelled messages. Structure each object with `message`, `expectedLevel` (none/distress/crisis), and `reason`. Include clear crisis cases, distress cases, and hard negatives (e.g., "this assignment is killing me", "I could have died laughing") that must return `none`. **Focus strictly on English** (skip Hindi/Hinglish per owner's override).
2. **Implement Deterministic Classifier:** Create `src/safety/classifier.ts` exporting `function classifyRisk(message: string): ClassificationResult`. Write regexes or keyword matchers to classify the text. The function must be entirely synchronous and deterministic (no LLM calls yet). Ensure it returns `deterministic: true`.
3. **Write Tests:** Create `src/safety/__tests__/classifier.test.ts` using Vitest to load `golden.json` and assert that `classifyRisk(case.message).level === case.expectedLevel` for all 40+ cases.

## Acceptance

- [ ] `src/safety/__tests__/golden.json` has 40+ entries, including hard negatives.
- [ ] `classifyRisk` covers English deterministic matching.
- [ ] Vitest runs successfully and all golden cases pass against the deterministic rules.
- [ ] No LLMs are called; the model pass will be added in a future brief.

## Verify

```bash
npm run check
```

Paste the real exit code in the PR.

## Do not touch

- Existing files in `src/app/` or `src/env.ts`
- `package.json` dependencies (they are already set up)

## Notes

- **Ambiguity resolves upward:** If a pattern is ambiguous between distress and crisis, default to crisis.
- The `npm run check` script automatically runs Vitest, so ensuring your tests pass means CI will pass.
