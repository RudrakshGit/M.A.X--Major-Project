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
      <Link href="/" className="flex-1">
        <span className="text-2xl font-display font-bold tracking-tight text-ink">M.A.X</span>
      </Link>
      <Link
        href="/settings"
        className="text-ink-muted hover:text-ink transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </Link>
      {/* Present on every screen at every risk level, per docs/safety.md. */}
      <Link
        href="/referrals"
        className="rounded-lg border border-signal/30 bg-signal/10 px-3 py-1.5 text-sm font-medium text-signal transition-colors hover:bg-signal/20"
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
