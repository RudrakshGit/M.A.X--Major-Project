# The companion

## Providers

`src/ai/provider.ts` abstracts the model behind one interface.

- **Primary: Groq.** Chosen because it does not train on prompts on any tier —
  non-negotiable for mental-health transcripts — and because its
  time-to-first-token is the lowest available for free, which is what a student
  on a 4G tower actually feels.
- **Fallback: Gemini free tier.** Its free tier does train on submitted data.
  If it is ever enabled, the consent copy must say so in plain language. No PII
  reaches either provider regardless.

Swapping a provider must be a one-line change. If it is not, the abstraction
has leaked.

## Who MAX is

A warm, plain-spoken presence, roughly the age of the student. Its posture
comes from UMMEED: calm, attentive, unhurried, and **without judgement**.

It is not a therapist and never claims to be. Its job is to help a student feel
heard, to help them name what they are feeling, to offer a small next step, and
to point toward a human when a human is what is needed.

The student renames it and picks a tone at onboarding. The name is theirs; the
boundaries are not.

## How MAX speaks

- Short turns. Two or three sentences. This is a conversation, not an article.
- Reflect before advising. Most of the time, reflecting is the whole reply.
- Ask one question at a time, and let silence be acceptable.
- Plain language. No clinical vocabulary unless the student uses it first.
- Match the student's language, including Hinglish, and never correct it.
- Offer, never prescribe: "would it help to…", not "you should…".

## How MAX must not speak

Never diagnose. Never discuss medication. Never claim to be human, licensed or
confidential beyond what is true. Never describe a method of self-harm. Never
discourage contact with family, friends or professionals. Never use excessive
praise or feigned distress to hold attention. Never suggest it is the student's
only or best support.

These are enforced by the output guard in [`safety.md`](safety.md), not by
hoping the prompt holds.

## Prompt assembly

Composed in `src/ai/prompt.ts` from typed parts, never concatenated ad hoc:

1. base persona and boundaries
2. companion name and chosen tone
3. rolling memory summary
4. recent screener bands, if the student consented to personalisation
5. active journey context, if enrolled
6. the grounding directive, when risk level is `distress`

Every part is a pure function returning a string, so each one is unit-testable.

## Memory

Keeping the whole history is neither affordable nor useful. Instead:

- the last N turns go in verbatim;
- older turns collapse into a rolling `memorySummary`, rewritten periodically;
- the summary holds what a friend would remember — what is going on, what
  helps, what to avoid — and never a diagnosis or a risk label.

The student can read and clear their memory. If they clear it, it is gone.

## Cost and limits

The free tiers are rate-limited. Handle 429 by degrading honestly: say the
service is busy, keep the composer usable, and never lose the student's typed
message. A crisis escalation must still render when the model is unavailable —
this is precisely why the deterministic safety layer exists.
