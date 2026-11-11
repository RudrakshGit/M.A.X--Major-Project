import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Header, PhoneIcon } from "@/components/ui";
import { TRY_URL } from "@/content/app";

export const metadata: Metadata = { title: "Try the demo", description: "Try MAX in your browser, no sign-up. A demo of the Android app, with a few limits." };

// The demo, on this site (owner, 11 Nov 2026: "Try now" should stay on the website and say it's a demo). The app's
// own web build runs inside a phone frame, so the demo is always the real, current app; it shows its own demo bar
// only when opened outside this page.
const LIMITS = ["20 chat messages a day", "No reminders, voice notes or backup", "Your data stays in this browser only"];

export default function Try() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* phones: one slim bar, then the app fills the screen */}
      <header className="flex items-center justify-between gap-2 border-b border-hair bg-raised px-3 py-2 md:hidden">
        <Link href="/" className="flex items-center gap-2" aria-label="MAX home">
          <img src="/max-logo.svg" alt="" width={32} height={28} className="h-7 w-auto" />
          <span className="rounded-full bg-tint-exam px-2 py-0.5 font-display text-xs font-semibold">Demo</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/download" className="rounded-[10px] bg-ink px-3 py-1.5 font-display text-sm font-semibold text-paper">
            Get the app
          </Link>
          <Link href="/help" className="inline-flex items-center gap-1 rounded-full bg-help px-2.5 py-1.5 font-display text-xs font-semibold text-white">
            <PhoneIcon /> Help
          </Link>
        </div>
      </header>
      <iframe src={TRY_URL} title="MAX demo" className="block h-[calc(100dvh-49px)] w-full border-0 md:hidden" allow="clipboard-write" />

      {/* wider screens: the site's header, what the demo is on the left, the app in a phone on the right */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="mx-auto hidden w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-8 md:grid md:grid-cols-[1fr_auto]">
        <div className="space-y-5">
          <span className="inline-block rounded-full bg-tint-exam px-3 py-1 font-display text-sm font-semibold">Demo</span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">Try MAX right here</h1>
          <p className="max-w-md text-lg text-ink2">
            This is the real app, running in your browser with no sign-up. Check in, talk to MAX, try a calming tool or write in the
            journal.
          </p>
          <ul className="space-y-2 text-ink2">
            {LIMITS.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink" />
                {l}
              </li>
            ))}
          </ul>
          <div className="btn-row flex flex-wrap gap-3">
            <ButtonLink href="/download">Get the full app</ButtonLink>
            <ButtonLink href="/" kind="secondary">
              Back to the site
            </ButtonLink>
          </div>
          <p className="text-sm text-ink3">
            MAX is not a counsellor. In danger? Call <a className="font-semibold text-ink underline" href="tel:112">112</a> or Tele-MANAS{" "}
            <a className="font-semibold text-ink underline" href="tel:14416">14416</a>.
          </p>
        </div>
        <div className="rounded-[44px] border-[10px] border-ink bg-ink shadow-[0_16px_40px_rgba(26,24,22,0.18)]">
          <iframe src={TRY_URL} title="MAX demo" className="block h-[min(760px,calc(100dvh-120px))] w-[360px] rounded-[34px] border-0 bg-paper" allow="clipboard-write" />
        </div>
      </div>
    </div>
  );
}
