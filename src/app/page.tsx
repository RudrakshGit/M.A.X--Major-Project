import Link from "next/link";
import { Headline } from "@/components/Headline";
import { HeroMax } from "@/components/HeroMax";
import { MaxPoses } from "@/components/MaxPoses";
import { Sketch } from "@/components/Sketch";
import { ButtonLink, Page } from "@/components/ui";

// The landing page: MAX's own look (paper, ink, the character). Two ways in: the demo here on the site, or the
// Android app. Then what it does (every feature is on /features), MAX itself, privacy, demo vs app, colleges.

const FEATURES = [
  { title: "Check in", body: "Mood, sleep, phone use and study pressure in four taps. MAX spots the pattern before you do.", tint: "bg-tint-exam" },
  { title: "Talk it out", body: "An AI companion that listens, in English or Hinglish. If your words sound unsafe, real helplines come first.", tint: "bg-tint-thoughts" },
  { title: "Calm down fast", body: "One-minute breathing, 5-4-3-2-1 grounding, a thought reframe and a spiral breaker.", tint: "bg-tint-calm" },
  { title: "Write it down", body: "A private journal with feeling tags and voice notes, and an optional short reflection from MAX.", tint: "bg-tint-kind" },
  { title: "Short courses", body: "Five-minute daily lessons for exam stress, overthinking, sleep and getting going again.", tint: "bg-tint-focus" },
  { title: "Check yourself", body: "Validated self-checks like PHQ-9 and GAD-7. You get a range and next steps, never a diagnosis.", tint: "bg-tint-sleep" },
];

const SCREENS = [
  { src: "/screens/today.jpg", label: "Today", alt: "Today: a daily plan, a thought from MAX and the 30-second check-in" },
  { src: "/screens/explore.jpg", label: "Explore", alt: "Explore: calming tools, courses and reads, each with a picture of MAX" },
  { src: "/screens/talk.jpg", label: "Talk", alt: "Talk: a conversation with MAX in Hinglish" },
];

export default function Home() {
  return (
    <Page>
      {/* hero */}
      <section className="grid items-center gap-8 pb-14 pt-6 sm:pt-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="font-hand text-xl leading-none text-ink2">for college days that feel heavy</p>
          <Headline className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl" />
          <p className="max-w-xl text-lg leading-relaxed text-ink2">
            MAX is a free, private wellbeing companion for students in India. Check in, talk it out, or try a calming tool,
            whenever you need it.
          </p>
          <div className="btn-row flex flex-wrap gap-3">
            <ButtonLink href="/try">Try the demo</ButtonLink>
            <ButtonLink href="/download" kind="secondary">
              Download for Android
            </ButtonLink>
          </div>
        </div>
        <div className="hero-max relative mx-auto w-full max-w-sm pt-4">
          {/* a speech bubble that comes out of MAX's head */}
          <div className="relative mx-auto mb-1 w-fit max-w-[15rem] translate-x-10">
            <div className="rounded-[18px] border-[1.5px] border-ink bg-raised px-5 py-3">
              <p className="font-hand text-lg leading-snug">Hi, I&apos;m Max. Rough day? Tell me about it.</p>
            </div>
            <svg aria-hidden viewBox="0 0 40 28" className="absolute -bottom-[25px] left-8 h-7 w-10 overflow-visible">
              <path d="M2 0 C 4 10, 6 18, 1 27 C 12 20, 20 10, 24 0" fill="var(--color-raised)" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M3.5 -1 L 22.5 -1" stroke="var(--color-raised)" strokeWidth="3" />
            </svg>
          </div>
          <HeroMax className="float mx-auto mt-6 w-64 sm:w-72" />
        </div>
      </section>

      {/* what it does */}
      <section aria-labelledby="what" className="space-y-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="what" className="font-display text-3xl font-semibold">What MAX does</h2>
          <Link href="/features" className="underline underline-offset-4">See every feature</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Sketch key={f.title} id={`feature-${f.title}`} className="p-5">
              <div className={`mb-4 h-2 w-12 rounded-full ${f.tint}`} aria-hidden />
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-ink2">{f.body}</p>
            </Sketch>
          ))}
        </div>
      </section>

      {/* MAX, the character: kept plain, one picture and four short lines (owner, 11 Nov 2026) */}
      <section aria-labelledby="meet" className="grid items-center gap-10 py-10 md:grid-cols-[0.8fr_1.2fr]">
        <MaxPoses />
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 id="meet" className="font-display text-3xl font-semibold">Meet MAX</h2>
            <p className="text-lg text-ink2">The little companion inside the app. Give it any name you like.</p>
          </div>
          <dl className="divide-y divide-hair border-y border-hair">
            {[
              ["Talks with you", "In English or Hinglish, one gentle question at a time."],
              ["Reacts to you", "Listens while you type, breathes with you, notices a heavy day."],
              ["Stays close", "Floats on the other tabs; tap it for quick shortcuts."],
              ["Has its moments", "Goes for a walk, naps, and tugs a lamp when you change the theme."],
            ].map(([t, d]) => (
              <div key={t} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-display font-semibold">{t}</dt>
                <dd className="text-ink2">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* screens */}
      <section aria-labelledby="look" className="space-y-6 py-10">
        <h2 id="look" className="font-display text-3xl font-semibold">Inside the app</h2>
        <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {SCREENS.map((s) => (
            <figure key={s.src} className="w-60 shrink-0 snap-center sm:w-auto">
              <div className="overflow-hidden rounded-[28px] border-[6px] border-ink bg-paper shadow-[0_10px_30px_rgba(26,24,22,0.12)]">
                <img src={s.src} alt={s.alt} width={375} height={812} className="block h-auto w-full" loading="lazy" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-ink3">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* privacy */}
      <section aria-labelledby="private" className="grid gap-8 py-10 md:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <h2 id="private" className="font-display text-3xl font-semibold">Your data stays yours</h2>
          <p className="text-ink2">Your journal never leaves your phone unless you back it up.</p>
        </div>
        <ul className="grid gap-3 text-ink2 sm:grid-cols-2">
          {[
            "Check-ins, journal and results stay on your phone. A Google backup is optional.",
            "Chats go through our server to the AI and aren't kept there. Names and numbers are stripped first.",
            "No ads, no tracking, no selling data. Delete everything with one button.",
            "Colleges only ever see totals from 10 or more students, and only if you choose to share.",
          ].map((x) => (
            <li key={x} className="flex gap-3">
              <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* demo vs app */}
      <section aria-labelledby="versions" className="space-y-6 py-10">
        <h2 id="versions" className="font-display text-3xl font-semibold">Try it first, then take it with you</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* both cards keep one height and their buttons on one line, with room above them */}
          <Sketch id="web-version" className="h-full p-6 sm:p-7" inner="flex h-full flex-col">
            <h3 className="font-display text-xl font-semibold">The demo, in your browser</h3>
            <p className="mt-3 text-ink2">No sign-up. Check-ins, chat, tools, journal, courses and self-checks.</p>
            <p className="mt-2 text-sm text-ink3">20 chat messages a day. Everything stays in this browser.</p>
            <div className="mt-auto pt-7">
              <ButtonLink href="/try">Try the demo</ButtonLink>
            </div>
          </Sketch>
          <Sketch id="app-version" className="h-full p-6 sm:p-7" inner="flex h-full flex-col">
            <h3 className="font-display text-xl font-semibold">The MAX app</h3>
            <p className="mt-3 text-ink2">Everything in the demo, plus reminders, voice notes, automatic screen time, app lock, Google backup and sharing anonymous stats with your college.</p>
            <p className="mt-2 text-sm text-ink3">No daily chat limit. Free, Android.</p>
            <div className="mt-auto pt-7">
              <ButtonLink href="/download" kind="secondary">
                Download for Android
              </ButtonLink>
            </div>
          </Sketch>
        </div>
      </section>

      {/* colleges */}
      <section aria-labelledby="colleges" className="py-10">
        <Sketch id="colleges" className="p-6 sm:p-8" fill="var(--color-tint-calm)">
          <div className="max-w-2xl space-y-3">
            <h2 id="colleges" className="font-display text-3xl font-semibold">For counsellors and colleges</h2>
            <p className="text-ink2">
              See how your students are doing, week by week: mood, sleep, study pressure, and what they say weighs on them.
              Plan support around exams. You never see a single student.
            </p>
            <p className="text-sm text-ink3">Register your college, get a College ID for students, and open the dashboard.</p>
          </div>
          <div className="pt-7">
            <ButtonLink href="/college">Open the college dashboard</ButtonLink>
          </div>
        </Sketch>
      </section>
    </Page>
  );
}
