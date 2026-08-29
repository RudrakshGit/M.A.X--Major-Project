# 006 — Chat Persistence & Rolling Memory

- **Status:** ready
- **Phase:** PH-02
- **Branch:** `feat/rolling-memory-companion`
- **Read before starting:** `docs/ai.md`, `project/state.json`

## Outcome

The student's conversation with MAX is saved to the database. The companion can be renamed. To prevent exceeding context limits, conversations that grow long are periodically summarized into a rolling memory that influences the companion's tone and context.

## Files

| File | Action |
| --- | --- |
| `src/features/chat/actions.ts` | create |
| `src/ai/memory.ts` | create |
| `src/app/api/chat/route.ts` | modify |
| `src/features/chat/components/chat-interface.tsx` | modify |
| `src/app/(app)/page.tsx` | modify |
| `src/features/settings/components/companion-settings.tsx` | create |

## Steps

1. **Database Server Actions (`src/features/chat/actions.ts`)**:
   - `getOrCreateConversation(userId: string)`: Returns the current conversation.
   - `loadChatHistory(conversationId: string)`: Loads historical messages for the UI.
   - `saveMessage(conversationId, role, content, riskLevel)`: Persists a message to the database.
   - `updateCompanion(userId, name, tone)`: Updates the companion table settings.

2. **Rolling Memory (`src/ai/memory.ts`)**:
   - `generateMemorySummary(userId, conversationId)`: Fetches the last N messages, summarizes them using Groq into a concise JSON or text block, and upserts it into the `memorySummary` table.

3. **API Route Update (`src/app/api/chat/route.ts`)**:
   - Extract `session.user.id` using `auth.api.getSession`.
   - Save the incoming user message to the DB using `saveMessage`.
   - Before building the system prompt, fetch the `companion` config (name, tone) and `memorySummary` and inject them.
   - On `streamText` finish callback (`onFinish`), save the assistant's message.
   - Trigger `generateMemorySummary` in the background (fire and forget) if message count warrants it.

4. **UI Hydration (`src/app/(app)/page.tsx` & `chat-interface.tsx`)**:
   - Make `page.tsx` an async Server Component.
   - Fetch the active conversation history and pass it to `ChatInterface` as `initialMessages`.

5. **Settings UI (`companion-settings.tsx`)**:
   - A simple settings form to update the companion's name and tone.

## Acceptance

- [ ] Chat messages persist across page reloads.
- [ ] Renaming the companion changes the system prompt.
- [ ] `npm run check` passes.

## Verify

```bash
npm run check
```
