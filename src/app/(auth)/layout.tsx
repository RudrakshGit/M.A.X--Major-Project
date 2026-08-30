export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex flex-col items-center">
            <h1 className="text-4xl font-display font-bold text-ink tracking-tight">M.A.X</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-clay/10 text-clay border border-clay/20 mt-1">
              Mental-health Assistance &amp; eXpert
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            Your empathetic mental buddy — a safe, confidential space for college students.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
