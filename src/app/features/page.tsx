import type { Metadata } from "next";
import { Sketch } from "@/components/Sketch";
import { ButtonLink, Page } from "@/components/ui";

export const metadata: Metadata = { title: "Everything MAX does", description: "Every feature of the MAX app: check-ins, the AI companion, calming tools, journal, courses, self-checks, sounds, reminders, privacy." };

// Every feature, one section per area (owner, 11 Nov 2026). "App" marks what the demo leaves out.
type Item = { name: string; body: string; app?: boolean };
type Group = { id: string; title: string; intro: string; tint: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: "daily",
    title: "Every day",
    intro: "A quick look at how you're doing, and one small thing to do about it.",
    tint: "bg-tint-exam",
    items: [
      { name: "30-second check-in", body: "Mood, last night's sleep, phone use in the hour before sleep, and study pressure, plus one small thing that went okay." },
      { name: "Daily plan", body: "Three small steps for today, like a check-in, a one-minute reset and a lesson. They tick themselves off when you do them." },
      { name: "A thought from MAX", body: "A short line to think about each day. Ask for another one, or for fewer." },
      { name: "Today's reflection", body: "A short reflection in three parts, written from your week's check-ins." },
      { name: "Mood and patterns", body: "A mood calendar, how your weeks are spread, a chart of mood, sleep, phone and pressure, and patterns MAX notices. Share a short summary with a counsellor if you want." },
    ],
  },
  {
    id: "talk",
    title: "Talk to MAX",
    intro: "An AI companion for the moments you want to say it out loud.",
    tint: "bg-tint-thoughts",
    items: [
      { name: "A companion that listens", body: "Replies in your language and script, English or Hinglish, with one gentle question at a time and simple ways to think it through." },
      { name: "Knows your week, not your journal", body: "It can use your check-in averages and plans to notice patterns. Switch that off any time." },
      { name: "Safety first", body: "If your words sound unsafe, free helplines come first, and MAX keeps talking with you, asking whether you're safe." },
      { name: "Private conversations", body: "Hide the messages with one tap, keep separate conversations, and jump from a reply straight to a tool." },
      { name: "No daily limit", body: "The demo allows 20 messages a day; the app has no daily limit.", app: true },
    ],
  },
  {
    id: "calm",
    title: "Calm down fast",
    intro: "Short tools for when your body or your thoughts are racing.",
    tint: "bg-tint-calm",
    items: [
      { name: "Breathing", body: "One minute of cyclic sighing, box breathing or 4-7-8, with MAX breathing along." },
      { name: "5-4-3-2-1 grounding", body: "Five things you see, four you hear, down to one: a way back into the room." },
      { name: "Thought reframe", body: "Write the situation and the thought that stung, then find a fairer one." },
      { name: "Spiral breaker", body: "Name what pulls you into a spiral and plan what you'll do instead next time." },
      { name: "My safety plan", body: "Warning signs, what helps, people and places, and a person to call, ready for hard moments." },
    ],
  },
  {
    id: "journal",
    title: "Journal",
    intro: "Write it down, even a few messy lines.",
    tint: "bg-tint-kind",
    items: [
      { name: "Guided entries", body: "Pick how you feel, what's affecting you (exams, hostel, family...), then write." },
      { name: "A short reflection", body: "Optional: MAX suggests feeling tags and writes two or three warm lines about your entry." },
      { name: "Talk about it", body: "Send an entry to MAX to talk it through." },
      { name: "Voice notes", body: "Speak instead of typing, up to two minutes, and turn it into text if you want.", app: true },
    ],
  },
  {
    id: "learn",
    title: "Learn",
    intro: "Small, practical lessons, a few minutes at a time.",
    tint: "bg-tint-focus",
    items: [
      { name: "Courses", body: "Short daily lessons: Stress toolkit, Exam stress, Overthinking & worry, Sleep reset, Get going again and Kind to yourself." },
      { name: "Quick reads", body: "Your body's alarm system, feelings as weather, the one-minute reset, thinking traps, your phone and your sleep, and loops that pull you back." },
      { name: "Watch and read", body: "Videos and guides from trusted sources, with a Hindi and Hinglish filter." },
    ],
  },
  {
    id: "check",
    title: "Check yourself",
    intro: "Validated self-checks. You get a range and next steps, never a diagnosis, and results stay with you.",
    tint: "bg-tint-sleep",
    items: [
      { name: "Mental wellness", body: "Low mood (PHQ-9), worry (GAD-7, PSWQ), wellbeing (WHO-5), sleep (SCI), loneliness, burnout, resilience and self-esteem." },
      { name: "Screeners", body: "Adult ADHD (ASRS v1.1) and autism traits (AQ-10), as a first step towards talking to a professional." },
      { name: "Personal growth and personality", body: "Big Five personality, career interests, perfectionism and body appreciation." },
      { name: "Digital balance", body: "A weekly tech-stress check." },
    ],
  },
  {
    id: "sounds",
    title: "Sounds and focus",
    intro: "For studying, winding down and sleeping.",
    tint: "bg-tint-calm",
    items: [
      { name: "Focus sessions", body: "A focus timer from 5 to 120 minutes." },
      { name: "Sounds", body: "Calm sounds and sound masks to block out room and campus noise, with a sleep timer." },
      { name: "Your own music", body: "Save the playlists that help you from Spotify, YouTube Music or JioSaavn, or songs on your phone." },
    ],
  },
  {
    id: "phone",
    title: "Phone, sleep and exams",
    intro: "The habits around your day.",
    tint: "bg-tint-exam",
    items: [
      { name: "Automatic screen time", body: "Screen time, pickups, late-night use and your top apps, read from Android on your phone and never sent anywhere.", app: true },
      { name: "Evening reminder", body: "At most one a day, never after you've checked in, and it learns when you usually do.", app: true },
      { name: "Wind-down", body: "A gentle nudge an hour before your bedtime.", app: true },
      { name: "Exams and deadlines", body: "Add them and MAX offers a brain dump, focus sessions and the exam course in the days before." },
    ],
  },
  {
    id: "safety",
    title: "Help and privacy",
    intro: "Help is always one tap away, and your data stays yours.",
    tint: "bg-tint-kind",
    items: [
      { name: "Help button", body: "The red Help button on every main screen opens free helplines like Tele-MANAS 14416, your safety-plan contact and your college counsellor." },
      { name: "On your phone", body: "Check-ins, journal and results stay on your phone. Export a copy or delete everything with one button." },
      { name: "App lock", body: "Fingerprint or PIN to open MAX; Help still works while locked.", app: true },
      { name: "Google backup", body: "Optional: get everything back on a new phone.", app: true },
      { name: "Share with your college", body: "Add your College ID to add your check-in numbers to its anonymous totals. Never your name or words.", app: true },
    ],
  },
  {
    id: "yours",
    title: "Make it yours",
    intro: "Small touches that make MAX feel like your own.",
    tint: "bg-tint-thoughts",
    items: [
      { name: "Name your companion", body: "MAX can be called whatever you like." },
      { name: "Avatars", body: "Hand-drawn avatars to pick from." },
      { name: "Light and dark", body: "MAX tugs a lamp cord and the new colour spreads across the page like ink." },
      { name: "How much MAX moves", body: "Normal, calm or still." },
      { name: "Floating MAX", body: "A companion in the corner of the other tabs, with shortcuts.", app: true },
    ],
  },
];

export default function Features() {
  return (
    <Page>
      <section className="space-y-4 pb-6 pt-2 sm:pt-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Everything MAX does</h1>
        <p className="max-w-2xl text-lg text-ink2">
          All of it is free. Most of it works in the demo too; the parts marked <span className="rounded-full bg-ink px-2 py-0.5 text-sm font-semibold text-paper">App</span> need the Android app.
        </p>
        <nav aria-label="Sections" className="flex flex-wrap gap-2 pt-2">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-[12px] border-[1.5px] border-rule bg-raised px-3 py-1.5 text-sm hover:border-ink">
              {g.title}
            </a>
          ))}
        </nav>
      </section>

      <div className="space-y-14 py-6">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-6 space-y-5">
            <div className="space-y-2">
              <div className={`h-2 w-12 rounded-full ${g.tint}`} aria-hidden />
              <h2 id={`${g.id}-title`} className="font-display text-3xl font-semibold">{g.title}</h2>
              <p className="text-ink2">{g.intro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <Sketch key={it.name} id={`${g.id}-${it.name}`} className="space-y-2 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">{it.name}</h3>
                    {it.app ? <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-paper">App</span> : null}
                  </div>
                  <p className="text-ink2">{it.body}</p>
                </Sketch>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-hair py-10">
        <p className="font-display text-2xl font-semibold">See it for yourself</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/try">Try the demo</ButtonLink>
          <ButtonLink href="/download" kind="secondary">
            Download for Android
          </ButtonLink>
        </div>
      </section>
    </Page>
  );
}
