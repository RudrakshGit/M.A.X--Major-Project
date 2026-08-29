# 012 — Hindi and English across the whole app

- **Status:** ready
- **Phase:** PH-04
- **Branch:** `feat/i18n-hindi`
- **Read before starting:** `docs/design-system.md` (the Voice section)

## Outcome

Every user-facing string renders in both Hindi and English, and a student can
switch language from settings. No hardcoded English text remains in a component.

## Why this is not optional

The problem statement says "especially in rural and semi-urban colleges".
Hindi is a graded requirement, not a nice-to-have. See `docs/product.md`.

## Files

| File | Action |
| --- | --- |
| `package.json` | add `next-intl` |
| `src/i18n/routing.ts` | create — locales `["en","hi"]`, default `en` |
| `src/i18n/request.ts` | create — request config |
| `src/i18n/messages/en.json` | create — every string, namespaced by feature |
| `src/i18n/messages/hi.json` | create — same keys, native Hindi |
| `next.config.ts` | wrap with the next-intl plugin |
| `src/app/layout.tsx` | provide the locale and messages |
| every file under `src/app/` and `src/features/` | replace literal strings with `t("key")` |
| `src/features/settings/components/language-switcher.tsx` | create |

## Contract

```ts
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi"] as const,
  defaultLocale: "en",
});
export type Locale = (typeof routing.locales)[number];
```

Message keys are namespaced by feature: `chat.placeholder`, `journal.empty`,
`screeners.phq9.title`. Never a flat bag of keys.

## Steps

1. Install and wire `next-intl` with the routing above.
2. Sweep `src/app/` and `src/features/` for literal user-facing strings. Add a
   key for each into `en.json`, then translate into `hi.json`.
3. Persist the chosen locale on `user.locale` — the column already exists.
4. Add the language switcher to the settings page.
5. Verify Devanagari renders in the heading font. If it does not, change the
   font before finishing — a broken Hindi heading fails this brief.

## Acceptance

- [ ] `grep -rn '>[A-Z][a-z]\{3,\}' src/features src/app --include="*.tsx"` finds
      no user-facing literal outside a `t()` call
- [ ] `en.json` and `hi.json` have identical key sets — no key exists in one only
- [ ] Switching to Hindi changes every visible string, including empty and error states
- [ ] Devanagari renders with no tofu boxes on the home, chat and journal screens
- [ ] `npm run check` exits 0

## Verify

```bash
npm run check
```

## Do not touch

`src/safety/`, `src/db/schema.ts`, `src/features/institution/`.

## Notes

Hindi is written natively, not translated word for word. Stiff literal Hindi
reads as bureaucratic, which is the opposite of stigma-free. Crisis card copy
must be reviewed especially carefully — read `docs/safety.md` before touching it.
