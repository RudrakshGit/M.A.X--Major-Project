# MAX website — agent guide

The public site for MAX: landing, features, demo, download, helplines and the college counsellors' dashboard. The
student app is a separate Expo project (`../max-app`, repo MAX-mobile). Read `README.md` first.

## Map

- `src/app/` pages · `src/components/` UI (`Sketch` outlines, plain buttons) and `college/` dashboard
- `src/lib/max-api.ts` is the only code that talks to the MAX server
- `src/content/app.ts` APK version and file · `src/content/referrals.ts` helplines (same as the app)

## Rules

- The dashboard never shows one student: it only renders what the server returns (10+ students, blurred).
- No student accounts here. Only college staff sign in, with Google; registering needs no sign-in.
- Helplines need no sign-in and match the app's Help screen.
- Look like the app: tokens in `globals.css`; only card outlines are sketched, buttons stay plain; keep sections simple.
- No secrets in the repo; the Google client id comes from `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- No AI attribution in commits or PRs.

## Traps

- EAS Hosting replaces the browser's Origin header, so the MAX server allows any origin on the college routes and
  accepts only bearer tokens (`max-app/src/server/cors.ts`).
- After `vercel deploy --prod`, run `vercel alias set <deployment> max-mental-health-expert.vercel.app`.

## Check

```bash
npm run check && npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
