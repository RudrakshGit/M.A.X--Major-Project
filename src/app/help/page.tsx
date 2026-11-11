import type { Metadata } from "next";
import { Sketch } from "@/components/Sketch";
import { PhoneIcon, Page, buttonClass } from "@/components/ui";
import { helplines } from "@/content/referrals";

export const metadata: Metadata = { title: "Get help now", description: "Free, confidential helplines in India, open to anyone." };

// Readable without any account: someone in crisis should never have to sign up first.
export default function Help() {
  return (
    <Page>
      <section className="mx-auto max-w-2xl space-y-6 py-10">
        <Sketch id="danger" className="space-y-3 p-6" stroke="var(--color-help)">
          <h1 className="font-display text-3xl font-semibold text-help">You deserve support right now, from a person.</h1>
          <p className="text-ink2">These lines are free and confidential. If you are in immediate danger, call 112.</p>
          <a href="tel:112" className={buttonClass("danger")}>
            <PhoneIcon className="h-4 w-4" /> Call 112
          </a>
        </Sketch>
        <div className="space-y-4">
          {helplines.map((h) => (
            <Sketch key={h.name} id={`line-${h.name}`} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-display text-xl font-semibold">{h.name}</h2>
                <p className="text-ink2">{h.note}</p>
              </div>
              <a href={`tel:${h.dial}`} className={buttonClass(h.dial === "14416" ? "danger" : "secondary")}>
                <PhoneIcon className="h-4 w-4" /> {h.number}
              </a>
            </Sketch>
          ))}
        </div>
        <p className="text-sm text-ink3">Numbers checked October 2026, the same list as in the MAX app.</p>
      </section>
    </Page>
  );
}
