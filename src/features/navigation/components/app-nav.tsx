"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, NotebookPen, ClipboardList, BookOpen, Compass, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/assessments", label: "Check in", icon: ClipboardList },
  { href: "/resources", label: "Read", icon: BookOpen },
  { href: "/journeys", label: "Journeys", icon: Compass },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppHeader() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-4 sm:px-8 border-b border-ink/5 bg-surface">
      <Link href="/" className="flex-1 flex flex-col justify-center group min-w-0">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl font-display font-extrabold tracking-tight text-ink">
            M.A.X
          </span>
          <span className="text-sm sm:text-base font-display font-semibold text-ink/85 tracking-tight">
            Mental-health Assistance &amp; Expert
          </span>
        </div>
        <p className="text-[11px] font-sans text-ink-muted/80 tracking-normal leading-tight mt-0.5">
          Your safe, empathetic college mental buddy · Always here to listen
        </p>
      </Link>
      <Link
        href="/settings"
        className="text-ink-muted hover:text-ink transition-colors p-2 rounded-lg hover:bg-ink/5"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </Link>
      {/* Present on every screen at every risk level, per docs/safety.md. */}
      <Link
        href="/referrals"
        className="rounded-lg border border-signal/30 bg-signal/10 px-3.5 py-1.5 text-sm font-medium text-signal transition-colors hover:bg-signal/20 shrink-0 shadow-2xs"
      >
        Urgent help
      </Link>
    </header>
  );
}

export function AppTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="shrink-0 border-t border-ink/5 bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-xs transition-colors",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span className={cn(active && "font-medium")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
