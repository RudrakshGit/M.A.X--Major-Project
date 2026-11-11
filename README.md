# M.A.X - Mental-health Assistance & eXpert

A stigma-free mental health support system for students in higher education.

**Major project E-G18** · Guide: Mr. Devendra Kuril
Prayagi Sahajwani · Sanskriti Kachole · Raja Jain · Rudraksh Mishra

> Indian colleges now carry a legal duty to provide mental health support that
> most rural and semi-urban campuses cannot staff. M.A.X is the digital
> instrument that fills the gap between "a counsellor is mandated" and
> "a counsellor exists".

## What this repo is

The public website for MAX: a landing page, the Android download, helplines, and the anonymous dashboard for college
counsellors. The student app is the MAX Android app (separate Expo project); its web version is "Try now" at
https://max-companion.expo.app. See `HANDOFF.md`.

**Live:** https://max-mental-health-expert.vercel.app

## Local development

```bash
npm install
npm run dev
```

## Stack

Next.js · Tailwind · roughjs (sketched card outlines) · Google Identity Services · Vercel Hobby. Data comes from the
MAX server (Expo Router API routes on EAS Hosting, Postgres on Neon). Every tier is free.
