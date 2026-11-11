"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

// A hand-drawn outline around a card, like the app's sketched frames (max-app/src/ui/sketch). Drawn once at the
// card's real size with a seed from its id, so it doesn't change between renders. Only card outlines are sketched;
// buttons and fields stay plain (owner, 11 Nov 2026).

const gen = rough.generator();
const seedFrom = (id: string) => {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return Math.abs(h) % 2147483647 || 1;
};

export function Sketch({ id, className = "", inner = "", children, stroke = "var(--color-rule)", fill = "var(--color-raised)" }: { id: string; className?: string; inner?: string; children: React.ReactNode; stroke?: string; fill?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // the outline goes round the whole card, padding included (contentRect leaves the padding out)
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth, h = el.offsetHeight;
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  let d = "";
  if (size && size.w > 8 && size.h > 8) {
    const r = Math.min(16, size.h / 3), W = size.w - 4, H = size.h - 4;
    const path = `M${r},0 H${W - r} Q${W},0 ${W},${r} V${H - r} Q${W},${H} ${W - r},${H} H${r} Q0,${H} 0,${H - r} V${r} Q0,0 ${r},0 Z`;
    d = gen.toPaths(gen.path(path, { seed: seedFrom(id), roughness: 0.9, bowing: 0.6, strokeWidth: 1.4, stroke: "x" }))
      .map((p) => p.d)
      .join(" ");
  }
  return (
    <div ref={box} className={`relative rounded-[16px] ${className}`} style={{ background: fill }}>
      {d ? (
        <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={size!.w} height={size!.h}>
          <path d={d} transform="translate(2 2)" fill="none" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[16px] border border-rule/60" />
      )}
      <div className={`relative ${inner}`}>{children}</div>
    </div>
  );
}
