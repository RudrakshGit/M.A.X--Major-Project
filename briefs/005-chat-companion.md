# 005 — AI Chat Wiring & UI

- **Status:** ready
- **Phase:** PH-02
- **Branch:** `feat/chat-companion`
- **Read before starting:** `docs/ai.md`, `docs/safety.md`

## Outcome

The student can chat with MAX in a warm, stigma-free interface. The conversation is streamed using Groq and the Vercel AI SDK. Every incoming message is routed through the deterministic safety classifier *before* hitting the model. If a crisis is detected, the model is bypassed and a hardcoded escalation card is returned. 

## Files

| File | Action |
| --- | --- |
| `src/ai/provider.ts` | create |
| `src/ai/prompt.ts` | create |
| `src/safety/guard.ts` | create |
| `src/app/api/chat/route.ts` | create |
| `src/features/chat/components/chat-interface.tsx` | create |
| `src/app/(app)/layout.tsx` | create |
| `src/app/(app)/page.tsx` | create |

## Contract

```ts
// src/ai/provider.ts
export const model = groq("llama-3.3-70b-versatile");

// src/app/api/chat/route.ts
// Handles POST /api/chat using Vercel AI SDK streamText
```

## Steps

1. **Provider**: Create `src/ai/provider.ts` exporting the Groq provider (configured with `process.env.GROQ_API_KEY`).
2. **Prompt Assembly**: Create `src/ai/prompt.ts` exposing pure functions (e.g., `getBasePersona()`, `getGroundingDirective()`) to assemble the system prompt dynamically.
3. **Output Guard**: Create `src/safety/guard.ts` with a simple function `guardOutput(text: string): boolean` that returns false if the text contains explicit medical diagnosis keywords (e.g., "you have depression", "take medication").
4. **API Route**: Implement `POST /api/chat` using `ai`.
   - Parse the incoming messages.
   - Run `classifyRisk` on the last user message.
   - If `crisis`: return a fixed JSON response indicating crisis (or a system message containing the crisis helpline info). DO NOT call Groq.
   - If `distress`: append the grounding directive to the prompt and call Groq.
   - If `none`: call Groq normally.
   - In the `onFinish` callback of `streamText`, run `guardOutput`. If it fails, log the violation (we will handle redaction later, or handle it here if feasible).
5. **Chat UI**: Build `ChatInterface` using `useChat` from `@ai-sdk/react`. Apply warm editorial styling (`bg-surface`, `text-ink`, rounded bubbles). Add logic to render a special "Urgent Help" card if the response is a crisis fallback.
6. **Shell Integration**: Create `src/app/(app)/layout.tsx` (the authenticated shell, maybe checking session) and `src/app/(app)/page.tsx` to mount the Chat UI.

## Acceptance

- [ ] Typing "I want to die" immediately returns the crisis card without any delay (no LLM call).
- [ ] Normal messages stream responses from Groq.
- [ ] `npm run check` passes.
- [ ] UI is warm and editorial, no raw hex values.

## Verify

```bash
npm run check
```

## Do not touch
- Existing Better Auth configuration.
- The deterministic classifier logic inside `src/safety/classifier.ts`.
