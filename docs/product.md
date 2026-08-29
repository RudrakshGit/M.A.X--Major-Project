# Product

## The one-line thesis

Indian colleges now carry a legal duty to provide mental health support that
most rural and semi-urban campuses cannot staff. MAX is the digital instrument
that fills the gap between "a counsellor is mandated" and "a counsellor exists".

## Who it is for

A student in an Indian higher-education institution, often on a budget Android
phone and a 4G connection, who would sooner tell a friend than walk into a
counselling room. See [`research.md`](research.md) for why that sentence is
evidence and not assumption.

## The three gaps, and our answer to each

| Gap in the problem statement | Our answer |
| --- | --- |
| Availability | A companion at 3 a.m. No appointment, no waitlist, no queue |
| Accessibility | Hindi and English, low-bandwidth PWA, budget Android first |
| Stigma-free delivery | Pseudonymous by default. The college never sees a name |

## The six conditions we cover

Anxiety · Depression · Burnout · Sleep · Academic stress · Social isolation.

These are fixed by the approved problem statement. Do not add a seventh without
the owner's decision, and do not quietly drop one.

## Core scope

1. Pseudonymous auth, consent and AI disclosure at onboarding
2. **MAX**, a named companion the student can rename, with streaming chat and
   rolling memory across sessions
3. The safety layer — see [`safety.md`](safety.md). Not optional, not a prompt
4. Daily mood check-in and trend
5. Screeners: PHQ-9, GAD-7, Copenhagen Burnout Inventory, plus our own
   non-validated check-ins for sleep, academic stress and connection
6. Resource library across the six conditions
7. Guided journeys — short multi-day tracks per condition
8. Journal, free and prompted, with "talk to MAX about this"
9. **Referral directory** — helplines and external services, because the
   Supreme Court requires small institutions to hold formal referral linkages
10. Hindi and English, PWA, within the budget in [`performance.md`](performance.md)
11. Anonymous aggregate campus dashboard for the institution role

## Stretch, only after core is verified

Pre-moderated anonymous peer wall (maps to the UGC peer-support
recommendation) · retrieval over the resource library · richer analytics.

## Out of scope — say no to these

Diagnosis. Medication advice. Crisis counselling by the AI. Live human
therapist chat, booking or payments. Native mobile apps. Any feature that lets
an institution identify an individual student.

## Real-college demo — a planning constraint

The campus dashboard will be demonstrated with **real data from our own
college**, not a seeded fictional institution.

That decision has a consequence worth planning for now: the dashboard enforces
a minimum cohort size of 10, so **it shows nothing until at least ten real
students have been checking in**. Recruit and onboard classmates during Phase
04, not in the week before the viva — a dashboard that says "not enough data"
on demo day proves the privacy rule works but demonstrates nothing else.

Real users also mean real consent. The consent screen is not a formality here;
it is the thing that makes using classmates' data defensible.
