# MAX website

The public website for **MAX** (Mental-health Assistance and eXpert), a free wellbeing companion for college students
in India. Major project E-G18, SVIIT, Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore · Guide: Mr. Devendra Kuril ·
Prayagi Sahajwani, Sanskriti Kachole, Raja Jain, Rudraksh Mishra.

**Live:** https://max-mental-health-expert.vercel.app · The app itself: [MAX-mobile](https://github.com/RudrakshGit/MAX-mobile)

## Pages

| Page | What it does |
| --- | --- |
| `/` | Landing: what MAX does, Meet MAX (tap to change its mood), screenshots, privacy, demo vs app, colleges |
| `/features` | Every feature by area; "App" marks what needs the Android app |
| `/try` | The demo: the app's own web build (https://max-companion.expo.app) in a phone frame, no sign-up |
| `/download` | The Android APK, served from `public/downloads/` |
| `/help` | Helplines, the same list as the app; no sign-in |
| `/college` | For counsellors: steps, a registration form (no sign-in), Google sign-in for the dashboard |
| `/admin` | MAX admins approve or reject college registrations |

All data comes from the MAX server (the app's API routes on EAS Hosting). This site has no database and no student
accounts.

## Run

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_GOOGLE_CLIENT_ID: the MAX server's Google web client id
npm run dev                  # http://localhost:3000
npm run check                # lint, typecheck, repo hygiene
```

## Deploy (Vercel)

```bash
npm run build
npx vercel deploy --prod --yes
npx vercel alias set <deployment-url> max-mental-health-expert.vercel.app
```

- `vercel deploy --prod` only updates `max-coral-ten.vercel.app`; the public address needs the `alias set` step.
- New APK: copy it to `public/downloads/` (git-ignored, deployed through `.vercelignore`) and update
  `src/content/app.ts`.
- Google sign-in on `/college` needs this site's address in the web OAuth client's "Authorized JavaScript origins".

## Stack

Next.js, Tailwind, roughjs (sketched card outlines), Google Identity Services, Vercel Hobby. Free tiers only.
