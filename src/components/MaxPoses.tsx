"use client";

import { useState } from "react";

// Meet MAX: tap MAX and it changes into another of its moods (owner, 11 Nov 2026). Same drawings as the app.
const POSES = [
  { src: "/max-smile.svg", label: "Happy to see you" },
  { src: "/max-happy.svg", label: "Waving hello" },
  { src: "/max-listening.svg", label: "Listening" },
  { src: "/max-calm.svg", label: "Breathing out" },
  { src: "/max-graduate.svg", label: "Exam season" },
  { src: "/max-worried.svg", label: "Noticing a heavy day" },
];

export function MaxPoses() {
  const [i, setI] = useState(0);
  const pose = POSES[i];
  return (
    <figure className="mx-auto flex w-full max-w-xs flex-col items-center">
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % POSES.length)}
        aria-label={`MAX: ${pose.label}. Tap to see another mood.`}
        className="max-poke group flex h-56 w-full cursor-pointer items-center justify-center rounded-[24px] sm:h-64">
        {/* the key restarts the little squash each time MAX changes */}
        <img key={pose.src} src={pose.src} alt="" width={260} height={230} className="max-pop h-full w-auto max-w-full object-contain" />
      </button>
    </figure>
  );
}
