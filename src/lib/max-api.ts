"use client";

import { TRY_URL } from "@/content/app";

// The college dashboard talks to the MAX server directly (it allows this site's origin, max-app/src/server/cors.ts).
// A counsellor signs in with Google; the server checks the ID token and returns its own session token, kept in this
// browser only. Types mirror max-app/src/app/api/college/*.

export type CollegeStatus = "pending" | "approved" | "rejected";
export type StaffCollege = {
  id: string;
  name: string;
  city: string;
  state: string;
  status: CollegeStatus;
  role: "owner" | "staff";
  code: string | null;
  reviewNote: string | null;
  counsellor: { name: string; phone: string; hours: string | null } | null;
  exams: { name: string; date: string }[];
  staff: { email: string; role: string }[] | null;
};
export type Mine = { email: string; admin: boolean; colleges: StaffCollege[] };
type Three = { mood: number; sleep: number; stress: number };
export type Dashboard = {
  days: number;
  enough: boolean;
  students: number | null;
  now?: Three;
  prev?: Three | null;
  shares?: { heavy: number; poorSleep: number; low: number };
  weeks: ({ week: string } & Three)[];
  sources: { id: string; label: string; pct: number }[];
  years: ({ year: number } & Three)[];
};
export type Registration = { name: string; city: string; state: string; aishe: string; website: string; role: string; phone: string; agree: boolean };
export type AdminCollege = { id: string; name: string; city: string; state: string; aishe: string | null; website: string | null; role: string; phone: string; email: string; status: CollegeStatus; note: string | null; createdAt: string };
export type Reason = "signed-out" | "not-configured" | "offline" | "forbidden" | "conflict" | "invalid" | "failed";
export type Result<T> = { ok: true; data: T } | { ok: false; reason: Reason };

const KEY = "max-staff-session";
export const getToken = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const setToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(KEY));
};
/** For useSyncExternalStore: signed in or not, following sign-in, sign-out and an expired session. */
export const subscribeSession = (onChange: () => void) => {
  window.addEventListener(KEY, onChange);
  window.addEventListener("storage", onChange);
  return () => (window.removeEventListener(KEY, onChange), window.removeEventListener("storage", onChange));
};

async function send<T>(path: string, init: RequestInit = {}): Promise<Result<T>> {
  const token = getToken();
  if (!token) return { ok: false, reason: "signed-out" };
  try {
    const res = await fetch(`${TRY_URL}${path}`, {
      ...init,
      headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${token}` },
    });
    if (res.ok) return { ok: true, data: res.status === 204 ? (undefined as T) : ((await res.json()) as T) };
    if (res.status === 401) setToken(null);
    const reason: Reason = res.status === 401 ? "signed-out" : res.status === 503 ? "not-configured" : res.status === 403 ? "forbidden" : res.status === 409 ? "conflict" : res.status === 400 ? "invalid" : "failed";
    return { ok: false, reason };
  } catch {
    return { ok: false, reason: "offline" };
  }
}

/** Trades a Google ID token for a MAX session. */
export async function signIn(idToken: string): Promise<{ ok: true; email: string } | { ok: false; reason: Reason }> {
  try {
    const res = await fetch(`${TRY_URL}/api/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
    if (!res.ok) return { ok: false, reason: res.status === 503 ? "not-configured" : res.status === 401 ? "invalid" : "failed" };
    const j = (await res.json()) as { token: string; email: string };
    setToken(j.token);
    return { ok: true, email: j.email };
  } catch {
    return { ok: false, reason: "offline" };
  }
}

export async function signOut() {
  await send("/api/auth/signout", { method: "POST" }).catch(() => {});
  setToken(null);
}

/** Register a college without signing in: it waits for verification, then the applicant signs in with that email. */
export async function applyCollege(r: Registration & { email: string }): Promise<Result<{ id: string }>> {
  try {
    const res = await fetch(`${TRY_URL}/api/college/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
    if (res.ok) return { ok: true, data: await res.json() };
    return { ok: false, reason: res.status === 409 ? "conflict" : res.status === 400 ? "invalid" : res.status === 503 ? "not-configured" : "failed" };
  } catch {
    return { ok: false, reason: "offline" };
  }
}

export const myColleges = () => send<Mine>("/api/college");
export const registerCollege = (r: Registration) => send<{ id: string }>("/api/college", { method: "POST", body: JSON.stringify(r) });
export const changeCollege = (body: { id: string; set: "contact" | "exams" | "addStaff" | "removeStaff" | "newCode" } & Record<string, unknown>) =>
  send<{ ok: true }>("/api/college", { method: "PATCH", body: JSON.stringify(body) });
export const collegeDashboard = (id: string, days: number) => send<Dashboard>(`/api/college/dashboard?id=${encodeURIComponent(id)}&days=${days}`);
export const adminColleges = () => send<{ colleges: AdminCollege[] }>("/api/college/admin");
export const reviewCollege = (id: string, action: "approve" | "reject", note?: string) =>
  send<{ ok: true; code?: string }>("/api/college/admin", { method: "POST", body: JSON.stringify({ id, action, note }) });

export const PROBLEM: Record<string, string> = {
  "not-configured": "College accounts aren't switched on on the MAX server yet.",
  offline: "Couldn't reach the MAX server. Check your connection and try again.",
  forbidden: "This account can't open that.",
  failed: "Something went wrong on the server. Please try again.",
};
