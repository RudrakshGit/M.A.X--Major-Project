# 001 — Scaffold the Next.js application

- **Status:** ready
- **Phase:** PH-01
- **Track:** D
- **Branch:** `feat/scaffold-app`
- **Read before starting:** `docs/architecture.md`

## Outcome

`npm run dev` serves a themed, bilingual empty shell, and `npm run check`
passes with exit code 0.

## Files

| File | Action |
| --- | --- |
| `package.json` | update — add app deps and scripts |
| `next.config.ts` | create |
| `tsconfig.json` | create |
| `src/app/layout.tsx` | create |
| `src/app/page.tsx` | create |
| `src/app/globals.css` | create — the only file with colour values |
| `src/i18n/messages.en.json` | create |
| `src/i18n/messages.hi.json` | create |
| `src/i18n/request.ts` | create |
| `src/env.ts` | create |
| `.env.example` | update |

## Contract

`src/env.ts` validates environment at boot. Fail loudly, not at request time.

```ts
import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GROQ_API_KEY: z.string().min(1),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
});

export const env = serverSchema.parse(process.env);
```

## Steps

1. Initialise Next.js with the App Router, TypeScript and Tailwind.
2. Install: `next-intl`, `zod`, `drizzle-orm`, `@neondatabase/serverless`,
   `better-auth`, `ai`, `@ai-sdk/groq`. Dev: `drizzle-kit`, `vitest`,
   `@playwright/test`, `eslint`, `prettier`.
3. Define tokens in `globals.css` under `@theme` — warm off-white surface, warm
   near-black ink, five muted pastel accents, one restrained signal colour, two
   radii, two shadows. Read `docs/design-system.md` for the intent.
4. Wire `next-intl` with `en` and `hi`. The home page renders one translated
   heading and one translated paragraph from the message files.
5. Pick heading and body faces that both carry Devanagari. Verify the Hindi
   heading renders before moving on.
6. Add scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `check`.
   `check` runs lint, typecheck and test in sequence and exits non-zero on any
   failure.

## Acceptance

- [ ] `npm run dev` serves the page at `/` with no console errors
- [ ] `/hi` renders Devanagari correctly, with no tofu boxes
- [ ] `src/app/globals.css` is the only file containing a colour value —
      `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.tsx` returns nothing
- [ ] `npm run check` exits 0
- [ ] `.env.example` lists every key in `src/env.ts` and contains no real values

## Verify

```bash
npm run check
```

## Do not touch

`docs/`, `project/state.json`, `briefs/`, `src/safety/`. This brief creates no
database tables, no auth flow and no chat.

## Notes

- Do not add a component library beyond shadcn primitives; do not add an
  animation library, an icon font or a state manager.
- Do not create `src/utils/` or `src/lib/helpers/`.
- Server Components by default. This brief should produce zero `"use client"`.
