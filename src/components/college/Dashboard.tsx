"use client";

import type { Dashboard as Data } from "@/lib/max-api";

// What staff see: only totals the server already checked (10+ students, slight noise, rounding). This component
// never receives anything about one student, so it can't show it by mistake. Ported from the app (archived
// max-app college screens) to the web.

const YEARS = ["", "1st year", "2nd year", "3rd year", "4th year", "5th year", "Postgraduate"];
const short = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export function Dashboard({ data, days, onDays, exams }: { data: Data; days: number; onDays: (d: number) => void; exams: { name: string; date: string }[] }) {
  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label="Period" className="flex gap-2">
        {[14, 30, 90].map((d) => (
          <button
            key={d}
            role="radio"
            aria-checked={d === days}
            onClick={() => onDays(d)}
            className={`min-h-10 flex-1 rounded-[12px] border-[1.5px] px-3 font-display text-sm font-semibold ${d === days ? "border-ink bg-ink text-paper" : "border-rule bg-raised text-ink"}`}>
            {d} days
          </button>
        ))}
      </div>

      {!data.enough || !data.now ? (
        <div className="space-y-1 rounded-[12px] border border-rule p-4">
          <p className="font-display text-lg font-semibold">Not enough students yet</p>
          <p className="text-ink2">
            Fewer than 10 students have shared check-ins in the last {days} days. Numbers appear once there are enough to keep everyone
            anonymous. Share your College ID in class groups, notice boards or orientation.
          </p>
        </div>
      ) : (
        <>
          <p className="text-ink2">About {data.students} students shared check-ins in the last {days} days.</p>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Mood" value={data.now.mood} prev={data.prev?.mood} better="up" />
            <Stat label="Sleep" value={data.now.sleep} prev={data.prev?.sleep} better="up" />
            <Stat label="Study pressure" value={data.now.stress} prev={data.prev?.stress} better="down" />
          </div>
          <p className="text-sm text-ink3">{data.prev ? `Out of 5. Arrows compare with the ${days} days before.` : "Out of 5."}</p>

          {data.shares ? (
            <Block title="How many check-ins said">
              <Share label="Heavy or intense study pressure" pct={data.shares.heavy} />
              <Share label="Slept badly or poorly" pct={data.shares.poorSleep} />
              <Share label="Feeling heavy or low" pct={data.shares.low} />
            </Block>
          ) : null}

          {data.weeks.length ? (
            <Block title="Week by week">
              <div className="flex gap-4 text-sm">
                <Legend className="bg-ink" label="Mood" />
                <Legend className="bg-rule" label="Study pressure" />
              </div>
              {data.weeks.map((w) => {
                const end = new Date(Date.parse(`${w.week}T12:00:00`) + 6 * 864e5).toISOString().slice(0, 10);
                const exam = exams.find((e) => e.date >= w.week && e.date <= end);
                return (
                  <div key={w.week} className="space-y-1 py-1">
                    <p className="text-sm text-ink3">{`Week of ${short(w.week)}${exam ? ` · ${exam.name}` : ""}`}</p>
                    <Bar value={w.mood} className="bg-ink" />
                    <Bar value={w.stress} className="bg-rule" />
                  </div>
                );
              })}
            </Block>
          ) : null}

          {data.sources.length ? (
            <Block title="What students say is affecting them">
              <p className="text-sm text-ink3">From the categories students pick in their journal. Never their words.</p>
              {data.sources.map((s) => (
                <Share key={s.id} label={s.label} pct={s.pct} unit="of students" />
              ))}
            </Block>
          ) : null}

          {data.years.length ? (
            <Block title="By year of study">
              {data.years.map((y) => (
                <div key={y.year} className="flex justify-between gap-3 py-1">
                  <span>{YEARS[y.year]}</span>
                  <span className="text-right text-ink2">{`mood ${y.mood.toFixed(1)} · sleep ${y.sleep.toFixed(1)} · pressure ${y.stress.toFixed(1)}`}</span>
                </div>
              ))}
              <p className="text-sm text-ink3">Years with fewer than 10 students are hidden.</p>
            </Block>
          ) : null}
        </>
      )}
      <p className="text-sm text-ink3">
        You never see a single student. Groups under 10 are hidden and every number is slightly blurred so no one can be picked out.
        Students can stop sharing and delete what they shared at any time.
      </p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value, prev, better }: { label: string; value: number; prev?: number; better: "up" | "down" }) {
  const diff = prev == null ? 0 : Math.round((value - prev) * 10) / 10;
  const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "";
  const worse = (better === "up" && diff < 0) || (better === "down" && diff > 0);
  return (
    <div className="min-w-0 space-y-0.5 rounded-[12px] border border-rule p-3">
      <p className="truncate text-sm text-ink3">{label}</p>
      <p className="font-display text-2xl font-semibold">{value.toFixed(1)}</p>
      {arrow ? <p className={`text-sm ${worse ? "text-help" : "text-ink2"}`}>{`${arrow} ${Math.abs(diff).toFixed(1)}`}</p> : null}
    </div>
  );
}

function Share({ label, pct, unit = "" }: { label: string; pct: number; unit?: string }) {
  return (
    <div className="space-y-1 pb-1">
      <div className="flex justify-between gap-3">
        <span>{label}</span>
        <span className="shrink-0 font-semibold">{`${pct}%${unit ? ` ${unit}` : ""}`}</span>
      </div>
      <div className="h-2 rounded bg-hair">
        <div className="h-2 rounded bg-ink" style={{ width: `${Math.max(2, Math.min(100, pct))}%` }} />
      </div>
    </div>
  );
}

function Bar({ value, className }: { value: number; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 rounded bg-hair">
        <div className={`h-2.5 rounded ${className}`} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className="w-8 text-right text-sm">{value.toFixed(1)}</span>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${className}`} aria-hidden />
      {label}
    </span>
  );
}
