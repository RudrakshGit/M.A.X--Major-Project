# Design system

Reference: [most.org.au](https://www.most.org.au/) — warm, editorial,
non-clinical, co-designed with young people. We are aiming at that feeling, not
copying that layout.

## The feeling we want

A student opens this at 2 a.m. after a bad day. It should feel like a warm room
with the light on, not a hospital form and not a wellness startup.

Warm pastels, generous whitespace, rounded cards, large expressive headings,
simple hand-drawn-feeling illustrations, obvious navigation. Supportive, never
saccharine. Structured, never clinical.

## Avoid the generic AI look

The fastest way to make this look like a template: purple-to-blue gradients,
glassmorphism, a dark hero with neon accents, floating 3D blobs, four identical
feature cards with generic line icons, `Inter` at every weight, emoji as
section headers. Do not use any of it. If a screen could belong to any SaaS
landing page, it is wrong for this product.

## Tokens

Defined once in `src/app/globals.css` under `@theme`. **No hex value appears
anywhere else in the codebase.** No arbitrary radii, no one-off shadows.

- **Surface** — warm off-white paper, not pure white. A deeper warm tone for cards.
- **Ink** — soft near-black with a warm cast. Never `#000`.
- **Accents** — a small set of muted pastels: clay, sage, sand, sky, dusk.
  Each condition gets one, used consistently across resources and journeys.
- **Signal** — one restrained colour for urgent help. It must be findable
  without being alarming; a student in crisis should not meet a red alert.
- Radii: two values. Shadows: two values. Spacing: the Tailwind scale, unmodified.

Dark mode ships in Phase 3, driven by the same tokens.

## Type

- One display face for headings, set large and confident, with tight leading.
- System stack for body text — free, instant, and already on the device.
- Comfortable body size, generous line height. This is reading, not scanning.
- Both faces must carry **Devanagari**, or Hindi will fall back and look broken.
  Check this before choosing, not after.

## Components

shadcn/ui, generated into `src/ui/` and then owned by us. Reuse before you
create. A new primitive needs a reason in the PR.

Every interactive component ships with its loading, empty, error and keyboard
states. An empty state is a design surface here, not a fallback — "no entries
yet" is a chance to invite the first one.

## Voice

- Second person, present tense, contractions. Write how a person talks.
- Short sentences. Plain words.
- Never congratulate a student for suffering, never call anything a "journey to
  wellness", never use "just" ("just try breathing").
- Hindi is a translation of meaning, not of words. Stiff, literal Hindi reads
  as bureaucratic — the exact opposite of stigma-free.

## Accessibility

Not a phase-4 cleanup. WCAG AA contrast on every token pair, visible focus
rings, full keyboard paths, labelled form controls, `prefers-reduced-motion`
respected, and a sensible heading order. Verified headlessly in Playwright.
