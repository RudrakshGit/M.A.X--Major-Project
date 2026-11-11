# MAX website — agent operating guide

The public website for MAX (major project E-G18): a landing page, the Android download, helplines, and the
college counsellors' dashboard. The student app itself is a separate Expo project (`../max-app`); its web build is
"Try now" at https://max-companion.expo.app. Read `HANDOFF.md` first.

## Map

- `src/app/` pages: `/` landing, `/try` (the demo), `/download`, `/help`, `/college` (dashboard), `/admin`.
- `src/components/` shared UI (`Sketch` outlines, plain buttons), `college/` dashboard client components.
- `src/lib/max-api.ts` the only code that talks to the MAX server (college and auth routes).
- `src/content/` the app version and APK details (`app.ts`), helplines (`referrals.ts`, same list as the app).

## Invariants

- **The dashboard never sees one student.** It only shows what the server returns (10+ students, blurred).
- **No accounts for students on this site.** Students use the app or "Try now"; only staff sign in, with Google.
- **Helplines need no sign-in** and match the app's Help screen.
- **No secrets in the repo.** The Google client id comes from `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- **Look like the app:** its tokens in `globals.css`; only card outlines are sketched, buttons are plain.
- No AI attribution in commits or PRs.

## Check

```bash
npm run check   # lint + typecheck + repo hygiene
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
