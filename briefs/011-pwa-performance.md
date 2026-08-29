# 011 — PWA Offline Shell & Performance

- **Status:** merged
- **Phase:** PH-04
- **Branch:** `feat/pwa-performance`
- **Read before starting:** `project/state.json`

## Outcome

MAX works as a Progressive Web App (PWA). Students can access static routes (Resources, Journeys) while offline, and the First Load JS size is verified to be under 150 KB (gzipped) for core routes to meet the rural performance budget.

## Files

| File | Action |
| --- | --- |
| `package.json` | modify |
| `next.config.ts` | modify |
| `src/app/manifest.ts` | create |
| `src/app/sw.ts` | create |
| `src/app/layout.tsx` | modify |

## Context
- Using `@serwist/next` (as the modern successor to next-pwa).
- Target bundle size: < 150 KB gzipped.

## Steps

1. **Install Dependencies**:
   - `npm i @serwist/next`
2. **PWA Configuration**:
   - Update `next.config.ts` with `withSerwist`.
   - Create `src/app/manifest.ts` (Next.js 14+ manifest file) returning PWA details.
   - Create `src/app/sw.ts` containing Serwist logic.
   - Add manifest link in `src/app/layout.tsx`.
3. **Bundle Check**:
   - Run `npm run build` and ensure the JS bundle is lean.

## Acceptance

- [ ] `next.config.ts` configures PWA correctly.
- [ ] Manifest and SW are active.
- [ ] App builds successfully with an acceptable bundle size.

## Verify

```bash
npm run build
```
