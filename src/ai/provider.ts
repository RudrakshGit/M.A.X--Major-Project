import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Groq deprecated llama-3.3-70b-versatile on 2026-06-17 and names
// openai/gpt-oss-120b as the migration target. The old id returned 404 on every
// request, which surfaced as an empty 200 response and a chat that never replied.
export const MODEL_ID = "openai/gpt-oss-120b";

export const model = groq(MODEL_ID);
