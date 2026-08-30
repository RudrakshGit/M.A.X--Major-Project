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
    <header className="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-8 border-b border-ink/5 bg-surface">
      <Link href="/" className="flex-1 flex items-center gap-3 group">
        {/* Brand Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-ink text-surface flex items-center justify-center font-display font-bold text-sm shadow-xs transition-transform group-hover:scale-105 shrink-0">
          M
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-display font-extrabold tracking-tight text-ink leading-tight">
              M.A.X
            </span>
            <span className="text-[11px] font-medium text-ink/60 hidden md:inline-block border-l border-ink/15 pl-2">
              Mental-health Assistance &amp; Expert
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-ink-muted leading-tight truncate">
            Your empathetic college mental health buddy
          </span>
        </div>
      </Link>
      <Link
        href="/settings"
        className="text-ink-muted hover:text-ink transition-colors p-1.5 rounded-md hover:bg-ink/5"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </Link>
      {/* Present on every screen at every risk level, per docs/safety.md. */}
      <Link
        href="/referrals"
        className="rounded-lg border border-signal/30 bg-signal/10 px-3 py-1.5 text-sm font-medium text-signal transition-colors hover:bg-signal/20 shrink-0"
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
