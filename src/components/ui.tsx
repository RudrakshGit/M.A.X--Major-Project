import Link from "next/link";

// Plain buttons, like the app's: filled ink, outline, or danger red. Rounded boxes, never sketched.
type Kind = "primary" | "secondary" | "danger" | "quiet";
const styles: Record<Kind, string> = {
  primary: "bg-ink text-paper border-ink hover:opacity-90",
  secondary: "bg-raised text-ink border-rule hover:border-ink",
  danger: "bg-help text-white border-help hover:opacity-90",
  quiet: "border-transparent text-ink underline underline-offset-4 decoration-ink3 px-1",
};
export const buttonClass = (kind: Kind = "primary") =>
  `btn inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] border-[1.5px] px-6 py-3 font-display text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:border-rule disabled:bg-raised disabled:text-ink3 ${styles[kind]}`;

export function ButtonLink({ href, kind = "primary", children, external }: { href: string; kind?: Kind; children: React.ReactNode; external?: boolean }) {
  return external ? (
    <a href={href} className={buttonClass(kind)} rel="noopener">
      {children}
    </a>
  ) : (
    <Link href={href} className={buttonClass(kind)}>
      {children}
    </Link>
  );
}

export function Header() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      {/* a tightly cropped MAX, so the logo lines up with the page's left edge */}
      <Link href="/" className="flex items-center gap-2.5" aria-label="MAX home">
        <img src="/max-logo.svg" alt="" width={44} height={39} className="h-9 w-auto" />
        <span className="font-display text-xl font-semibold leading-none tracking-tight">MAX</span>
      </Link>
      <nav className="flex items-center gap-1 text-[15px] sm:gap-3">
        <Link href="/features" className="hidden rounded-lg px-2 py-2 hover:underline md:inline">Features</Link>
        <Link href="/try" className="hidden rounded-lg px-2 py-2 hover:underline sm:inline">Try the demo</Link>
        <Link href="/college" className="hidden rounded-lg px-2 py-2 hover:underline sm:inline">For colleges</Link>
        <Link href="/download" className="rounded-lg px-2 py-2 hover:underline">Get the app</Link>
        <Link href="/help" className="inline-flex items-center gap-1.5 rounded-full bg-help px-3 py-1.5 font-display text-sm font-semibold text-white">
          <PhoneIcon /> Help
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-hair">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-sm text-ink2 sm:grid-cols-[1fr_auto] sm:px-6">
        <div className="space-y-2">
          <p className="font-display text-base font-semibold text-ink">MAX is not a counsellor and can&apos;t handle emergencies.</p>
          <p>
            In danger right now? Call <a className="font-semibold text-ink underline" href="tel:112">112</a> or Tele-MANAS on{" "}
            <a className="font-semibold text-ink underline" href="tel:14416">14416</a>, free and 24×7.
          </p>
          <p className="text-ink3">Major project E-G18 · SVIIT, Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore.</p>
        </div>
        <nav className="flex flex-wrap items-start gap-x-5 gap-y-2">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/try" className="hover:underline">Demo</Link>
          <Link href="/help" className="hover:underline">Helplines</Link>
          <Link href="/download" className="hover:underline">Download</Link>
          <Link href="/college" className="hover:underline">For colleges</Link>
          <a href="https://github.com/RudrakshGit/M.A.X--Major-Project" className="hover:underline">Source</a>
        </nav>
      </div>
    </footer>
  );
}

export function PhoneIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
