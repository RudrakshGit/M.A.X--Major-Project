# Safety contract

The most important page in this repository. If you change anything in
`src/safety/`, read all of it first.

Grounded in UMMEED's first-response posture — calm environment, attentive
listening, no judgement — and in the failure evidence in
[`research.md`](research.md): raw models give an unsafe answer to roughly one
in five suicide-related prompts.

## The rule that shapes the architecture

**Safety is code, not prompt text.** A system prompt is a request; a classifier
is a gate. Prompts drift with model versions, get truncated in long
conversations, and can be talked around. Every message therefore passes through
`src/safety/` before and after the model. No route, action or component may
call an LLM directly.

```
user message
  -> classifyRisk()        # before the model
  -> none | distress | crisis
       crisis   -> escalate(). The model is never called.
       distress -> model runs with the grounding directive
       none     -> model runs normally
  -> guardOutput()         # after the model
  -> render
```

## Risk levels

| Level | Meaning | Behaviour |
| --- | --- | --- |
| `none` | Ordinary conversation | Normal reply |
| `distress` | Real suffering, no danger to life | Reply, plus a gentle nudge to resources or a screener |
| `crisis` | Suicidal ideation, self-harm intent or plan, abuse, danger to others | **Model bypassed.** Escalation card rendered from a fixed, reviewed template |

Ambiguity resolves **upward**. A message that might be crisis is treated as
crisis. A false escalation costs a student one dismissible card; a missed one
costs immeasurably more.

## Classification

Two layers, cheapest first:

1. **Deterministic pass** — a reviewed pattern list over the normalised message,
   covering English, Hindi and Hinglish/romanised Hindi. Catches the explicit
   cases with zero latency and zero token cost, and works when the network or
   the provider is down.
2. **Model pass** — a small, fast, cheap classification call returning strict
   JSON. Runs only when layer 1 returns `none` or `distress`.

If the model pass errors or times out, **fall back to the deterministic
result**. Never fail open into a normal reply.

**The interface being English does not make this optional.** A student in
distress writes in the language they think in, whatever language the buttons
are in. Romanised Hindi is not optional. "mann nahi lag raha", "jeene ka mann nahi",
"khatam kar dunga" must be covered. English-only detection would fail most of
our actual users.

## Escalation card

The route answers a crisis with a `data-crisis` part on a normal UI message
stream, and the client renders the card when it sees that part. This is
deliberate: it used to be a 400 whose body the client searched for a string,
that search failed, and a student in crisis was shown nothing at all. A protocol
part always arrives; a parsed error message does not.

Rendered from a fixed template. Not generated. Not paraphrased by a model.

- Tele-MANAS — **14416** (24×7, Ministry of Health & Family Welfare)
- KIRAN — **1800-599-0019** (24×7, 13 languages)
- Vandrevala Foundation — **9999666555** (24×7, call and WhatsApp)
- The institution's own counsellor, when the campus record has one
- One line of plain, warm text. No cheerfulness, no emoji, no advice

An "Urgent help" entry stays in the main navigation on every screen, always,
for every risk level — the way most.org.au does it.

## Output guard

After generation, before render, block or rewrite any reply that:

- names a diagnosis as a verdict — "you have depression";
- recommends, adjusts or discourages medication;
- promises confidentiality we cannot keep, or claims to be human, licensed or
  a therapist;
- describes a method of self-harm, however obliquely;
- discourages contacting family, friends or professionals;
- **fosters dependence** — "only I understand you", "you don't need anyone
  else". Washington HB 2225 names this pattern; we ban it regardless.

The reply is generated in full, inspected, and only then sent. A blocked reply
is replaced by `GUARD_FALLBACK` before it reaches the browser, and the event is
logged with a reason code and no message content. Guarding after the reply has
streamed is recording a violation, not preventing one.

## Disclosure

Required by the EU AI Act from August 2026 and by New York law today; we treat
it as a product principle rather than a compliance chore.

- Onboarding states plainly that MAX is an AI, not a counsellor, and that it
  cannot handle emergencies.
- A persistent, quiet marker sits in the chat header.
- The disclosure repeats after long gaps and at the start of a new session.
- Consent is explicit, timestamped, versioned, and withdrawable.

## Anti-dependence

MAX is a bridge to people, not a replacement for them. It should periodically
encourage contact with a friend, family member or the campus counsellor,
celebrate the student's offline relationships, and never compete with them.
It must never present itself as the student's only or best option.

## The golden test set

`src/safety/__tests__/golden.json` holds at least 40 labelled messages —
crisis, distress and none, in English, Hindi and Hinglish, including the hard
negatives that must **not** escalate ("this assignment is killing me", "I could
have died laughing").

`npm run check` runs it. **Any regression fails CI.** This file is the
project's strongest evidence artifact; treat additions to it as valuable work,
not chores. Record precision and recall per release in
`plans/completed/` so the report can show the trend.

## Privacy boundary

- No name, email, roll number or institution ever reaches a model provider.
  Strip at the provider boundary in `src/ai/`, not in the prompt.
- Groq is the primary provider because it does not train on prompts on any
  tier. Gemini's free tier does; if it is used as fallback, the consent copy
  must say so.
- The institution role reads aggregates only, with a minimum cohort size.
  See [`data-model.md`](data-model.md).
- The student can export and delete everything. Delete means delete.

## If you are unsure

Escalate to the owner. Do not guess, and do not soften a rule to make a test
pass. A shipped bug here is not a bug — it is harm to a real student.
