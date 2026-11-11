"use client";

import { useState } from "react";
import { GoogleButton } from "@/components/GoogleButton";
import { Sketch } from "@/components/Sketch";
import { buttonClass } from "@/components/ui";
import { Register } from "./CollegeApp";

// The college page for visitors (owner, 11 Nov 2026): what it is, the steps, and the registration form right on the
// page. No sign-in to apply; staff sign in with Google only to open the dashboard once the college is approved.

const STEPS = [
  { n: 1, title: "Register", body: "Fill in the form below: your college and how to reach you. It takes two minutes." },
  { n: 2, title: "We verify", body: "The MAX team checks the college and calls the work phone you give, usually within 3 working days." },
  { n: 3, title: "Share the College ID", body: "Once approved you get a College ID. Students add it in the MAX app, only if they want to." },
  { n: 4, title: "Open the dashboard", body: "Sign in with Google using the email you registered. Numbers appear once 10 students share." },
];

const SEE = [
  "Average mood, sleep and study pressure, compared with the weeks before",
  "How many check-ins said heavy pressure, poor sleep or low mood",
  "Week by week, with your exam dates marked",
  "What students say is affecting them, from the categories they pick",
  "The same by year of study, for years with 10 or more students",
];

export function CollegeLanding({ onToken, note }: { onToken: (idToken: string) => void; note: string }) {
  const [sentTo, setSentTo] = useState<string>();
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* hero */}
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <p className="font-hand text-xl leading-none text-ink2">for counsellors and wellness cells</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">See how your students are doing. Never who.</h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink2">
            Students who use MAX can share their daily check-ins with their college, anonymously. You see the totals, week by week,
            and plan support around exams and hostel life.
          </p>
          <div className="btn-row flex flex-wrap gap-3">
            <a href="#register" className={buttonClass()}>
              Register your college
            </a>
            <a href="#sign-in" className={buttonClass("secondary")}>
              Already registered? Sign in
            </a>
          </div>
        </div>
        <img src="/max-graduate.svg" alt="MAX in a graduation cap" width={300} height={290} className="float mx-auto h-auto w-44 sm:w-56 md:w-64" />
      </section>

      {/* steps */}
      <section aria-labelledby="how" className="space-y-6">
        <h2 id="how" className="font-display text-3xl font-semibold">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="relative space-y-2 rounded-[16px] border border-hair bg-raised p-5">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-paper">
                {s.n}
              </span>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-ink2">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* what you see + privacy */}
      <section className="grid gap-6 md:grid-cols-2">
        <Sketch id="see" className="space-y-3 p-6">
          <h2 className="font-display text-2xl font-semibold">What the dashboard shows</h2>
          <ul className="space-y-2 text-ink2">
            {SEE.map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" />
                {x}
              </li>
            ))}
          </ul>
        </Sketch>
        <Sketch id="never" className="space-y-3 p-6" fill="var(--color-tint-calm)">
          <h2 className="font-display text-2xl font-semibold">What you never see</h2>
          <ul className="space-y-2 text-ink2">
            {[
              "A single student: no names, emails, roll numbers or devices",
              "Journal words, chats or self-check results",
              "Any group smaller than 10; every number is slightly blurred so no one can be picked out",
            ].map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" />
                {x}
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink3">Students choose to share, can stop any time, and can delete what they shared.</p>
        </Sketch>
      </section>

      {/* the form */}
      <section id="register" aria-labelledby="register-title" className="scroll-mt-6 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 id="register-title" className="font-display text-3xl font-semibold">Register your college</h2>
          <p className="text-ink2">Free. MAX checks every college before it goes live, so students only ever share with a real institution.</p>
        </div>
        {sentTo ? (
          <Sketch id="sent" className="max-w-2xl space-y-3 p-6" stroke="var(--color-ink)">
            <h3 className="font-display text-2xl font-semibold">Thank you, it&apos;s on its way</h3>
            <p className="text-ink2">
              We&apos;ll check your college and call the work phone you gave, usually within 3 working days. Once it&apos;s approved, sign in
              below with the Google account for <strong className="text-ink">{sentTo}</strong> to get your College ID and open the dashboard.
            </p>
          </Sketch>
        ) : (
          <div className="max-w-2xl">
            <Register onDone={(to) => setSentTo(to)} />
          </div>
        )}
      </section>

      {/* sign in */}
      <section id="sign-in" aria-labelledby="sign-in-title" className="scroll-mt-6">
        <Sketch id="sign-in-box" className="grid items-center gap-4 p-6 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1">
            <h2 id="sign-in-title" className="font-display text-2xl font-semibold">Already registered?</h2>
            <p className="text-ink2">Sign in with the Google account for the email you registered, or the one your colleague added as staff.</p>
            {note ? <p className="text-help">{note}</p> : null}
          </div>
          <GoogleButton onToken={onToken} />
        </Sketch>
      </section>
    </div>
  );
}
