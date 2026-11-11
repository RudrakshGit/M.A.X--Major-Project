"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Sketch } from "@/components/Sketch";
import { buttonClass } from "@/components/ui";
import { fieldClass } from "./CollegeApp";
import { adminColleges, reviewCollege, type AdminCollege } from "@/lib/max-api";

// MAX admin only (the server checks ADMIN_EMAILS). Verify before approving: the AISHE code on aishe.gov.in, the
// website, a call to the work phone, and whether the email is on the college's own domain.

const ROLE: Record<string, string> = { counsellor: "Counsellor", psychologist: "Psychologist", wellness: "Wellness cell", faculty: "Faculty", head: "Head / Director" };

export function AdminApp() {
  const [list, setList] = useState<AdminCollege[] | null>();
  const load = useCallback(() => adminColleges().then((r) => setList(r.ok ? r.data.colleges : null)), []);
  useEffect(() => {
    load();
  }, [load]);
  if (list === undefined) return <p className="py-10 text-ink3">Loading…</p>;
  if (list === null)
    return (
      <div className="space-y-3 py-10">
        <p className="text-ink2">Only MAX admins can review registrations. Sign in on the college page first.</p>
        <Link href="/college" className="underline underline-offset-4">Go to the college page</Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <h1 className="font-display text-3xl font-semibold">College registrations</h1>
      <p className="text-ink2">Before approving: look the college up on aishe.gov.in, open its website, and call the work phone to confirm the person works there.</p>
      {list.length === 0 ? <p className="text-ink3">No registrations yet.</p> : null}
      {list.map((c) => (
        <Card key={c.id} c={c} onDone={load} />
      ))}
    </div>
  );
}

function Card({ c, onDone }: { c: AdminCollege; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const domain = c.email.split("@")[1] ?? "";
  const act = async (action: "approve" | "reject") => {
    setBusy(true);
    await reviewCollege(c.id, action, reason.trim() || undefined);
    setBusy(false);
    onDone();
  };
  return (
    <Sketch id={`admin-${c.id}`} className="space-y-2 p-5" stroke={c.status === "pending" ? "var(--color-ink)" : "var(--color-rule)"}>
      <h2 className="font-display text-xl font-semibold">{c.name}</h2>
      <p className="text-ink2">{`${c.city}, ${c.state} · ${c.status}`}</p>
      <p>{`AISHE: ${c.aishe ?? "not given"}`}</p>
      <p>{`Applicant: ${ROLE[c.role] ?? c.role}, ${c.email}`}</p>
      <p className="text-sm text-ink3">{/(gmail|yahoo|outlook|hotmail|rediffmail|icloud|proton)\./i.test(domain) ? "Personal email: confirm by phone." : `Email domain: ${domain}. Check it matches the college website.`}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <a className="underline underline-offset-4" href={`tel:${c.phone.replace(/[^+0-9]/g, "")}`}>Call {c.phone}</a>
        <a className="underline underline-offset-4" href="https://aishe.gov.in" target="_blank" rel="noopener noreferrer">aishe.gov.in</a>
        {c.website ? <a className="underline underline-offset-4" href={c.website} target="_blank" rel="noopener noreferrer">Website</a> : null}
      </div>
      {c.note ? <p className="text-sm text-ink3">Note: {c.note}</p> : null}
      {c.status === "pending" ? (
        <div className="space-y-3 pt-2">
          <input className={fieldClass} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="Note for the applicant (needed when rejecting)" aria-label="Review note" />
          <div className="btn-row flex flex-wrap gap-3">
            <button className={buttonClass()} disabled={busy} onClick={() => confirm(`Approve ${c.name}? It gets a College ID and students can start sharing with it.`) && void act("approve")}>
              Approve
            </button>
            <button className={buttonClass("danger")} disabled={busy || reason.trim().length < 5} onClick={() => void act("reject")}>
              Reject
            </button>
          </div>
        </div>
      ) : null}
    </Sketch>
  );
}
