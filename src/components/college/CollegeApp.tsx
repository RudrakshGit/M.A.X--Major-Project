"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { GoogleButton } from "@/components/GoogleButton";
import { Sketch } from "@/components/Sketch";
import { buttonClass } from "@/components/ui";
import { Dashboard } from "./Dashboard";
import { CollegeLanding } from "./CollegeLanding";
import {
  PROBLEM,
  applyCollege,
  changeCollege,
  collegeDashboard,
  getToken,
  myColleges,
  registerCollege,
  signIn,
  signOut,
  subscribeSession,
  type Dashboard as DashData,
  type Mine,
  type Result,
  type StaffCollege,
} from "@/lib/max-api";

// The college dashboard (moved out of the app on 11 Nov 2026, owner): sign in with Google, register the college,
// wait for verification, then share the College ID with students and watch the anonymous totals.

export const fieldClass = "w-full min-h-12 rounded-[12px] border-[1.5px] border-rule bg-raised px-4 py-2 text-[15px] placeholder:text-ink3 focus:border-ink focus:outline-none";

export function CollegeApp() {
  // null while rendering on the server, then whether this browser holds a session
  const signedIn = useSyncExternalStore(subscribeSession, () => !!getToken(), () => null);
  const [mine, setMine] = useState<Result<Mine>>();
  const [picked, setPicked] = useState<string>();
  const [view, setView] = useState<"main" | "register" | "settings">("main");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    myColleges().then(setMine);
  }, []);
  useEffect(() => {
    if (signedIn) load();
  }, [signedIn, load]);

  const onToken = useCallback(
    async (idToken: string) => {
      setNote("");
      const r = await signIn(idToken);
      if (!r.ok) return setNote(r.reason === "offline" ? PROBLEM.offline : r.reason === "not-configured" ? PROBLEM["not-configured"] : "Sign-in didn't work. Please try again.");
    },
    [],
  );

  if (signedIn === null) return <p className="py-10 text-ink3">Loading…</p>;

  if (!signedIn) return <CollegeLanding onToken={onToken} note={note} />;

  const colleges = mine?.ok ? mine.data.colleges : [];
  const college = colleges.find((c) => c.id === picked) ?? colleges.find((c) => c.status === "approved") ?? colleges[0];

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      {!mine ? (
        <p className="text-ink3">Loading…</p>
      ) : !mine.ok ? (
        <div className="space-y-3">
          <p className="text-help">{PROBLEM[mine.reason] ?? PROBLEM.failed}</p>
          <button className={buttonClass("secondary")} onClick={load}>
            Try again
          </button>
        </div>
      ) : view === "register" ? (
        <Register email={mine.data.email} onDone={() => (setView("main"), load())} onCancel={() => setView("main")} />
      ) : view === "settings" && college ? (
        <Settings college={college} onChanged={load} onBack={() => setView("main")} />
      ) : (
        <>
          {mine.data.admin ? (
            <Link href="/admin" className="inline-block underline underline-offset-4">
              Review college registrations (MAX admin)
            </Link>
          ) : null}
          {colleges.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {colleges.map((c) => (
                <button key={c.id} className={buttonClass(c.id === college?.id ? "primary" : "secondary")} onClick={() => setPicked(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
          ) : null}
          {!college ? (
            <div className="space-y-4">
              <h1 className="font-display text-3xl font-semibold">Register your college</h1>
              <p className="text-ink2">You&apos;re signed in as {mine.data.email}. If a colleague already registered your college, ask them to add this email as staff.</p>
              <button className={buttonClass()} onClick={() => setView("register")}>
                Register a college
              </button>
            </div>
          ) : (
            <CollegeView college={college} onChanged={load} onSettings={() => setView("settings")} onRegister={() => setView("register")} />
          )}
        </>
      )}
      {mine?.ok ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-hair pt-6 text-sm text-ink3">
          <span>Signed in as {mine.data.email}</span>
          <button className="underline underline-offset-4" onClick={() => void signOut().then(() => setMine(undefined))}>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CollegeView({ college, onChanged, onSettings, onRegister }: { college: StaffCollege; onChanged: () => void; onSettings: () => void; onRegister: () => void }) {
  const [days, setDays] = useState(30);
  // each answer is kept with the period it's for, so switching periods shows "loading" without clearing state
  const [got, setGot] = useState<{ key: string; result: Result<DashData> }>();
  const want = `${college.id}:${days}`;
  const dash = got?.key === want ? got.result : undefined;
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (college.status !== "approved") return;
    collegeDashboard(college.id, days).then((result) => setGot({ key: `${college.id}:${days}`, result }));
  }, [college.id, college.status, days]);

  const message = `Join ${college.name} on MAX, a free student wellbeing app. In MAX: Settings → Share stats with college, College ID ${college.code}. You stay anonymous: the college only sees totals from 10+ students, never your name or journal, and you can stop any time.`;
  const copy = () => navigator.clipboard?.writeText(message).then(() => (setCopied(true), setTimeout(() => setCopied(false), 2000)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">{college.name}</h1>
        <p className="text-ink2">{`${college.city}, ${college.state} · ${college.role === "owner" ? "you registered it" : "staff"}`}</p>
      </div>
      {college.status === "pending" ? (
        <Sketch id="pending" className="space-y-2 p-5">
          <h2 className="font-display text-xl font-semibold">Waiting for verification</h2>
          <p className="text-ink2">
            MAX checks the AISHE code and website and may call the work phone you gave, usually within 3 working days. The dashboard and
            your College ID appear here once it&apos;s approved. Students can&apos;t join before that.
          </p>
          <button className="underline underline-offset-4" onClick={onChanged}>
            Check again
          </button>
        </Sketch>
      ) : college.status === "rejected" ? (
        <Sketch id="rejected" className="space-y-2 p-5" stroke="var(--color-help)">
          <h2 className="font-display text-xl font-semibold">Not approved</h2>
          <p className="text-ink2">{college.reviewNote ?? "MAX couldn't verify this college."}</p>
          <button className={buttonClass("secondary")} onClick={onRegister}>
            Register again with corrected details
          </button>
        </Sketch>
      ) : (
        <>
          <Sketch id="code" className="space-y-2 p-5" stroke="var(--color-ink)">
            <p className="text-sm text-ink3">College ID for students</p>
            <p className="font-display text-4xl font-semibold tracking-wide">{college.code}</p>
            <p className="text-sm text-ink3">Students enter it in the MAX app: Settings → Share stats with college, or while setting up.</p>
            <button className={buttonClass("secondary")} onClick={copy}>
              {copied ? "Copied" : "Copy a message for students"}
            </button>
          </Sketch>
          {!dash ? (
            <p className="text-ink3">Loading the numbers…</p>
          ) : !dash.ok ? (
            <p className="text-help">{PROBLEM[dash.reason] ?? PROBLEM.failed}</p>
          ) : (
            <Dashboard data={dash.data} days={days} onDays={setDays} exams={college.exams} />
          )}
          <button className={buttonClass("secondary")} onClick={onSettings}>
            College settings
          </button>
        </>
      )}
    </div>
  );
}

const ROLES = [
  { label: "Counsellor", value: "counsellor" },
  { label: "Psychologist", value: "psychologist" },
  { label: "Wellness cell", value: "wellness" },
  { label: "Faculty", value: "faculty" },
  { label: "Head / Director", value: "head" },
];
const FREE_MAIL = /@(gmail|yahoo|outlook|hotmail|rediffmail|icloud|proton)\./i;

/** The registration form. Signed in, it registers for that account; on the public page it asks for an email and
 * sends an application (no sign-in needed until it's approved). */
export function Register({ email, onDone, onCancel }: { email?: string; onDone: (sentTo?: string) => void; onCancel?: () => void }) {
  const [f, setF] = useState({ name: "", city: "", state: "", aishe: "", website: "", phone: "" });
  const [mail, setMail] = useState("");
  const mailOk = !!email || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail.trim());
  const [role, setRole] = useState("counsellor");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const aisheOk = !f.aishe.trim() || /^[CUScus]\s*-?\s*\d{3,6}$/.test(f.aishe.trim());
  const siteOk = !f.website.trim() || /^https?:\/\/\S{3,}$/i.test(f.website.trim());
  const phoneOk = /^\+?[0-9][0-9 -]{5,17}$/.test(f.phone.trim());
  const ready = f.name.trim().length >= 3 && f.city.trim().length >= 2 && f.state.trim().length >= 2 && phoneOk && aisheOk && siteOk && mailOk && agree;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote("");
    const r = email ? await registerCollege({ ...f, role, agree }) : await applyCollege({ ...f, role, agree, email: mail.trim().toLowerCase() });
    setBusy(false);
    if (r.ok) return onDone(email ? undefined : mail.trim().toLowerCase());
    setNote(
      r.reason === "conflict" ? "There's already a college waiting for verification with this email." : r.reason === "invalid" ? "Some details don't look right. Check the AISHE code, website and phone number." : r.reason === "offline" ? PROBLEM.offline : "Couldn't register right now. Please try again.",
    );
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {email ? (
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold">Register a college</h1>
          <p className="text-ink2">MAX checks every college before it goes live, so students only ever share with a real institution.</p>
        </div>
      ) : null}
      <fieldset className="space-y-3">
        <legend className="mb-2 font-display text-xl font-semibold">College</legend>
        <input className={fieldClass} value={f.name} onChange={set("name")} maxLength={120} placeholder="Full name, e.g. Shri Vaishnav Institute of Information Technology" aria-label="College name" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={fieldClass} value={f.city} onChange={set("city")} maxLength={60} placeholder="City" aria-label="City" />
          <input className={fieldClass} value={f.state} onChange={set("state")} maxLength={40} placeholder="State" aria-label="State" />
        </div>
        <input className={fieldClass} value={f.aishe} onChange={set("aishe")} maxLength={10} placeholder="AISHE code (optional), e.g. C-12345" aria-label="AISHE code" />
        {!aisheOk ? <p className="text-sm text-help">AISHE codes look like C-12345 (college), U-0123 (university) or S-12345.</p> : null}
        <input className={fieldClass} value={f.website} onChange={set("website")} maxLength={120} inputMode="url" placeholder="Website (optional), https://…" aria-label="College website" />
        {!siteOk ? <p className="text-sm text-help">Start the website with https://</p> : null}
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 font-display text-xl font-semibold">You</legend>
        {email ? (
          <p className="text-ink2">Signed in as {email}</p>
        ) : (
          <>
            <input className={fieldClass} value={mail} onChange={(e) => setMail(e.target.value)} type="email" maxLength={120} placeholder="Your work email (a Google account), e.g. name@college.edu.in" aria-label="Your email" />
            <p className="text-sm text-ink3">You&apos;ll sign in with the Google account for this email to open the dashboard once it&apos;s approved.</p>
          </>
        )}
        {FREE_MAIL.test(email ?? mail) ? <p className="text-sm text-ink3">A college email address makes verification faster.</p> : null}
        <div role="radiogroup" aria-label="Your role" className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.value}
              role="radio"
              aria-checked={role === r.value}
              onClick={() => setRole(r.value)}
              className={`min-h-10 rounded-[12px] border-[1.5px] px-3 text-sm ${role === r.value ? "border-ink bg-ink font-semibold text-paper" : "border-rule bg-raised"}`}>
              {r.label}
            </button>
          ))}
        </div>
        <input className={fieldClass} value={f.phone} onChange={set("phone")} maxLength={20} inputMode="tel" placeholder="Work phone, for the verification call" aria-label="Work phone" />
        {f.phone.trim() && !phoneOk ? <p className="text-sm text-help">That doesn&apos;t look like a phone number yet.</p> : null}
        <p className="text-sm text-ink3">Only the MAX team sees your phone number. Students never do.</p>
      </fieldset>
      <label className="flex items-start gap-3">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--color-ink)]" />
        <span>I work at this college and may set this up for it. I&apos;ll use the dashboard only to plan support, and I won&apos;t try to find out who any student is.</span>
      </label>
      <div className="btn-row flex flex-wrap gap-3">
        <button type="submit" className={buttonClass()} disabled={!ready || busy}>
          {busy ? "Sending…" : "Send for verification"}
        </button>
        {onCancel ? (
          <button type="button" className={buttonClass("quiet")} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      {note ? <p className="text-help">{note}</p> : null}
    </form>
  );
}

function Settings({ college, onChanged, onBack }: { college: StaffCollege; onChanged: () => void; onBack: () => void }) {
  const [note, setNote] = useState("");
  const owner = college.role === "owner";
  const save = async (body: Parameters<typeof changeCollege>[0], done: string) => {
    setNote("");
    const r = await changeCollege(body);
    if (!r.ok) return setNote(r.reason === "invalid" ? "Some details don't look right." : r.reason === "conflict" ? "That person is already staff, or the limit of 10 is reached." : r.reason === "offline" ? PROBLEM.offline : "That didn't work. Please try again.");
    setNote(done);
    onChanged();
  };
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <button className="text-sm underline underline-offset-4" onClick={onBack}>
          ← Back to the dashboard
        </button>
        <h1 className="font-display text-3xl font-semibold">{college.name}: settings</h1>
      </div>
      {note ? <p className="text-ink2" role="status">{note}</p> : null}
      <Contact college={college} onSave={(counsellor) => save({ id: college.id, set: "contact", counsellor }, "Saved. Students see it on their Help screen.")} />
      <Exams college={college} onSave={(exams) => save({ id: college.id, set: "exams", exams }, "Saved. Students see these in their Exams list.")} />
      {owner ? <Staff college={college} onAdd={(email) => save({ id: college.id, set: "addStaff", email }, `Added. They can now sign in with ${email}.`)} onRemove={(email) => save({ id: college.id, set: "removeStaff", email }, "Removed.")} /> : null}
      {owner && college.status === "approved" ? (
        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">College ID</h2>
          <p className="text-ink2">Current ID: {college.code}. Make a new one if the old one was posted somewhere public by mistake. Students who already joined stay connected.</p>
          <button className={buttonClass("secondary")} onClick={() => confirm("Make a new College ID? The old one stops working for new students straight away.") && void save({ id: college.id, set: "newCode" }, "New College ID made.")}>
            Make a new College ID
          </button>
        </section>
      ) : null}
    </div>
  );
}

function Contact({ college, onSave }: { college: StaffCollege; onSave: (c: { name: string; phone: string; hours: string }) => void }) {
  const [name, setName] = useState(college.counsellor?.name ?? "");
  const [phone, setPhone] = useState(college.counsellor?.phone ?? "");
  const [hours, setHours] = useState(college.counsellor?.hours ?? "");
  const phoneOk = /^\+?[0-9][0-9 -]{5,17}$/.test(phone.trim());
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Counsellor contact for students</h2>
      <p className="text-ink2">Shown on the Help screen of every student who joined, as a call button.</p>
      <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. Dr. Mehta, Student Wellness Cell" aria-label="Counsellor name" />
      <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} inputMode="tel" placeholder="Phone number" aria-label="Counsellor phone" />
      {phone.trim() && !phoneOk ? <p className="text-sm text-help">That doesn&apos;t look like a phone number yet.</p> : null}
      <input className={fieldClass} value={hours} onChange={(e) => setHours(e.target.value)} maxLength={60} placeholder="Hours (optional), e.g. Mon–Fri 10 am–5 pm, Room 204" aria-label="Hours" />
      <button className={buttonClass("secondary")} disabled={name.trim().length < 2 || !phoneOk} onClick={() => onSave({ name: name.trim(), phone: phone.trim(), hours: hours.trim() })}>
        Save contact
      </button>
    </section>
  );
}

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const nice = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function Exams({ college, onSave }: { college: StaffCollege; onSave: (e: { name: string; date: string }[]) => void }) {
  const today = key(new Date());
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => key(new Date(Date.now() + 7 * 864e5)));
  const upcoming = college.exams.filter((e) => e.date >= today);
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Exam dates</h2>
      <p className="text-ink2">Students who joined see these in their Exams list. MAX offers a brain dump and focus sessions in the days before. The dashboard marks these weeks.</p>
      {upcoming.map((e) => (
        <div key={`${e.name}${e.date}`} className="flex items-center justify-between gap-3 border-b border-hair py-2">
          <span>{`${e.name} · ${nice(e.date)}`}</span>
          <button className="text-sm underline underline-offset-4" aria-label={`Remove ${e.name}`} onClick={() => onSave(upcoming.filter((x) => x !== e))}>
            Remove
          </button>
        </div>
      ))}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. Mid-semester exams" aria-label="Exam name" />
        <input className={fieldClass} type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Exam date" />
      </div>
      <button
        className={buttonClass("secondary")}
        disabled={name.trim().length < 2 || !date}
        onClick={() => {
          onSave([...upcoming, { name: name.trim(), date }].sort((a, b) => a.date.localeCompare(b.date)));
          setName("");
        }}>
        Add exam date
      </button>
    </section>
  );
}

function Staff({ college, onAdd, onRemove }: { college: StaffCollege; onAdd: (email: string) => void; onRemove: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">Staff</h2>
      <p className="text-ink2">People who can see this dashboard. They sign in with the Google account for this email. Up to 10.</p>
      {(college.staff ?? []).map((s) => (
        <div key={s.email} className="flex items-center justify-between gap-3 border-b border-hair py-2">
          <span className="truncate">{`${s.email}${s.role === "owner" ? " (you, owner)" : ""}`}</span>
          {s.role !== "owner" ? (
            <button className="text-sm underline underline-offset-4" onClick={() => confirm(`Remove ${s.email}? They lose access straight away.`) && onRemove(s.email)}>
              Remove
            </button>
          ) : null}
        </div>
      ))}
      <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" maxLength={120} placeholder="colleague@yourcollege.edu.in" aria-label="Staff email" />
      <button className={buttonClass("secondary")} disabled={!ok} onClick={() => (onAdd(email.trim().toLowerCase()), setEmail(""))}>
        Add staff
      </button>
    </section>
  );
}
