"use client";

import { useSyncExternalStore } from "react";

// The hero line changes with the time of day, and between visits (owner, 11 Nov 2026). The server renders the first
// line; the browser picks one after loading, once per visit.

const LINES: Record<"morning" | "day" | "evening" | "night", string[]> = {
  morning: ["Good morning. Let's make today a little lighter.", "New day. Check in, then take it one class at a time."],
  day: ["Mid-day slump? One minute with MAX can reset it.", "Between lectures and deadlines, a small pause helps."],
  evening: ["Long day? Tell MAX about it.", "Evenings feel lighter when you write the day down."],
  night: ["A small friend for your mind, there at 2 am too.", "Can't sleep? MAX is up too."],
};
const FIRST = LINES.night[0];

let picked: string | null = null;
const pick = () => {
  if (picked) return picked;
  const h = new Date().getHours();
  const slot = h >= 5 && h < 12 ? "morning" : h >= 12 && h < 17 ? "day" : h >= 17 && h < 22 ? "evening" : "night";
  const options = LINES[slot];
  picked = options[Math.floor(Math.random() * options.length)];
  return picked;
};
const noop = () => () => {};

export function Headline({ className }: { className?: string }) {
  const line = useSyncExternalStore(noop, pick, () => FIRST);
  return <h1 className={className}>{line}</h1>;
}
