# References

What to borrow, from where, and what we are legally allowed to copy.
Licences verified 2026-08-29. Re-check before copying anything.

## The licence rule — read this first

| Licence | What it means for us |
| --- | --- |
| MIT, Apache-2.0, ISC | Copy freely. Keep the copyright notice. Attribute in `THIRD-PARTY.md` |
| **No licence file** | **All rights reserved.** Read it for ideas. **Never copy the code** |

A public GitHub repository is *not* automatically open source. Three of the
mental-health chatbots below have no licence at all. Reading them to understand
an approach is fine; lifting a function from them is a copyright violation, and
in a graded project that is plagiarism as well.

## Design reference

**[most.org.au](https://www.most.org.au/)** — the primary visual and structural
reference. Australian, government-funded, co-designed with young people.

Borrow: the warm non-clinical tone; card-based navigation; the way "Urgent
help" sits permanently in the main nav without alarming anyone; the therapy
journeys structure; separate paths for different user groups.

Do not copy: their illustrations, copy text, colour values or layout wholesale.
Take the *approach*, build our own.

## Feature references — apps worth studying

We cannot see their code. We study what they do and why it works.

| App | What to take |
| --- | --- |
| **Wysa** | The closest to MAX. AI chat plus exercises, gentle tone, escalation to a human. Study how it hands off |
| **MindShift CBT** | Thought journals, coping cards, and CBT tools aimed at anxiety specifically. Closest model for our thought-record exercise |
| **Moodfit** | Mood journal plus trend charts. Our check-in and trend screens should be about this simple |
| **SAM** | A self-built "anxiety toolkit" the user assembles. Good model for letting a student collect their own coping set |
| **Happify** | "Tracks" — guided multi-day programs. The structure our journeys follow |
| **Headspace / Calm** | Sleep content and wind-down flows. Take the pacing, not the production budget |
| **Insight Timer** | How a large free library stays navigable |
| **Talkspace** | Only as a contrast — the clinical, appointment-based model we deliberately are not |

Full feature list: [Eleanor Health — 10 best apps for mental health](https://www.eleanorhealth.com/blog/10-best-apps-for-mental-health).

## Code we may legally use

| Repository | Licence | Take |
| --- | --- | --- |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | MIT | All UI primitives. Generated into `src/ui/` and owned by us |
| [vercel/ai](https://github.com/vercel/ai) | Apache-2.0 | The AI SDK itself — `streamText`, `useChat`, provider adapters |
| [vercel/ai-chatbot](https://github.com/vercel/ai-chatbot) | Apache-2.0 | **Best starting point for the chat surface.** Streaming, message persistence, chat layout. Strip the parts we do not need |
| [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) | MIT | Chat UI components if `ai-chatbot` proves too heavy. Pick one, not both |
| [better-auth/better-auth](https://github.com/better-auth/better-auth) | MIT | Auth, with the Drizzle adapter |
| [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | Apache-2.0 | ORM and migrations |
| [colinhacks/zod](https://github.com/colinhacks/zod) | MIT | Every contract in this project |
| [amannn/next-intl](https://github.com/amannn/next-intl) | MIT | Hindi and English routing |
| [serwist/serwist](https://github.com/serwist/serwist) | MIT | PWA service worker and offline shell |
| [recharts/recharts](https://github.com/recharts/recharts) | MIT | Mood trend and campus dashboard charts. Load only on those routes |
| [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 | Headless UI verification |

Record everything we actually ship in `THIRD-PARTY.md` at the repository root.

## Code we may read but must not copy

| Repository | Licence | Why look at it |
| --- | --- | --- |
| [rrishi0309/Mental-Health-AI-Companion](https://github.com/rrishi0309/Mental-Health-AI-Companion) | MIT | The only mental-health one that is actually reusable. Retool-based, so mostly useful for prompt shape |
| [PoyBoi/MindEase](https://github.com/PoyBoi/MindEase) | **None** | Python counsellor assistant. Ideas only |
| [Huzaib/Mental-Health-ChatBot](https://github.com/Huzaib/Mental-Health-ChatBot) | **None** | Rasa NLU, CBT-structured. Useful for intent taxonomy. Ideas only |
| [kedarsdixit/mental-health-chatbot](https://github.com/kedarsdixit/mental-health-chatbot) | **None** | Ideas only |

None of these has a safety layer of the kind we are building. That gap is our
contribution, and it is worth saying so in the report.

## Where the rest lives

- Academic evidence, legal mandate, prevalence and efficacy citations →
  [`research.md`](research.md)
- Instrument licensing — PHQ-9, GAD-7, CBI and what we may not ship →
  [`research.md`](research.md) §6
- Helpline numbers → [`safety.md`](safety.md)
