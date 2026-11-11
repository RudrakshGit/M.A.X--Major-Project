# Current state — read this before you touch anything

Last updated 2026-11-11.

## What this site is now

Until November 2026 this repo was MAX's student web app (chat, journal, check-ins, its own database and logins).
The product is now the MAX Android app (`../max-app`), so on 11 Nov 2026 (owner) this repo became the public
website. The old student app is in git history (before this change); its features live in the app.

- `/` landing: what MAX does, screenshots, privacy, web vs app, colleges. "Try the demo" goes to `/try`;
  "Download for Android" to `/download`.
- `/try`: the demo, on this site (owner: it must stay on the website and say it's a demo). The app's own web build
  (https://max-companion.expo.app: no sign-up, data in the browser, 20 chats a day, no reminders, backup, voice
  notes or college sharing) runs in an iframe: a phone frame with the limits beside it on wide screens, full
  screen under a slim "Demo" bar on phones. Opened on its own, the web app shows its own demo bar.
- `/features`: every feature by area, "App" marking what the demo leaves out.
- Landing: the hero line changes with the time of day (`components/Headline.tsx`); MAX's right arm waves only on
  hover (`components/HeroMax.tsx`, CSS in `globals.css`); "Meet MAX" is deliberately plain (owner disliked cards).
- `/download`: the APK, served from `public/downloads/` (git-ignored, deployed by the Vercel CLI through
  `.vercelignore`). No sign-in: the APK is public and an account would only add friction. Update
  `src/content/app.ts` and copy the new APK in with each release.
- `/help`: the same helplines as the app.
- `/college`: a page for visitors with the steps and the registration form right there (no sign-in to apply:
  `POST /api/college/apply`, verified by phone in `/admin`, then the applicant signs in with Google using that email).
- `/college` (signed in) and `/admin`: the counsellors' dashboard, moved out of the app. Staff sign in with Google (Google
  Identity Services); the MAX server checks the ID token and issues its own session (kept in localStorage). All
  data comes from the MAX server's existing routes (`/api/college`, `/api/college/dashboard`, `/api/college/admin`).
- Old URLs redirect (`next.config.ts`); `public/sw.js` removes the old app's caching service worker.

## Traps

- The MAX server is EAS Hosting, which **replaces the browser's Origin header** with its own host, so CORS can't be
  limited by origin there; the college routes allow any origin and accept only bearer tokens (see
  `max-app/src/server/cors.ts`).
- Google sign-in on this site needs its address in the web OAuth client's **Authorized JavaScript origins**
  (Google Cloud console, owner).
- Deploy: `vercel --prod` (Vercel CLI, logged in as the project owner), with `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set.
