# Performance budget

Traceable to one phrase in the problem statement: "especially in rural and
semi-urban colleges". These are graded requirements, not preferences. The
evidence behind each number is in [`research.md`](research.md) §5.

## Budget

| Metric | Budget | Why |
| --- | --- | --- |
| First-load JS, gzipped | **≤ 150 KB** | Budget Androids carry >55% of Indian web traffic |
| Largest Contentful Paint, 4G mid-tier | **≤ 2.5 s** | Users close slow pages rather than wait |
| Time to first chat token | **≤ 1.5 s** | Groq's LPU is chosen for exactly this |
| Total transfer, first visit | **≤ 400 KB** | Data costs real money on a limited plan |
| Works fully on | **4G, 3–6 Mbps** | Real tier-2 speeds on crowded towers |
| Works at all on | **4G-only Android Go** | Under 5% of rural areas have 5G |

## How we stay inside it

- Server Components by default. Every client island is a deliberate decision.
- Illustrations are inline SVG. No photographic hero images, no icon fonts.
- System font stack first; at most one web font, subset, `font-display: swap`.
- No animation library. CSS transitions only.
- PWA with an offline shell: resources, journeys and past journal entries stay
  readable with no network. Chat degrades honestly — it says it needs a signal.
- Route-level code splitting; the campus dashboard's chart code never ships to
  a student.
- Optimistic UI on check-ins so a slow network never feels broken.

## Verification

`npm run check` fails the build if first-load JS exceeds the budget. Record a
Lighthouse run on mobile throttling in `plans/completed/` at each phase gate —
that trend is a report figure, not a chore.
