# 013 — Move colour into tokens

- **Status:** ready
- **Phase:** PH-04
- **Branch:** `fix/design-tokens`
- **Read before starting:** `docs/design-system.md`

## Outcome

`src/app/globals.css` is the only file in the repository containing a colour
value. Brief 001 required this and it was not met.

## Files

| File | Action |
| --- | --- |
| `src/app/globals.css` | add the missing semantic tokens |
| `src/app/(app)/**/*.tsx` | replace `bg-[#FAF9F6]` with the surface token |
| `src/app/layout.tsx`, `src/app/manifest.ts` | read theme colour from one exported constant |
| `src/features/assessments/components/screener-form.tsx` | same replacement |

## Steps

1. Define the tokens named in `docs/design-system.md` under `@theme`: warm
   off-white surface, a deeper card surface, warm near-black ink, the five muted
   accents (clay, sage, sand, sky, dusk), and the restrained signal colour.
2. Replace all 15+ `bg-[#FAF9F6]` occurrences with `bg-surface`.
3. `manifest.ts` and `layout.tsx` need real values, not CSS variables — export a
   single `themeColors` constant and read both from it, so the value is still
   defined once.

## Acceptance

- [ ] `grep -rEn "#[0-9a-fA-F]{3,8}" src --include="*.tsx" --include="*.ts" | grep -v globals.css | grep -v theme-colors` returns nothing
- [ ] No `bg-[#...]` arbitrary value anywhere in `src/`
- [ ] The app looks unchanged — this is a refactor, not a redesign
- [ ] `npm run check` exits 0

## Verify

```bash
npm run check
```

## Do not touch

Layout, spacing, component structure. Colour values only.
