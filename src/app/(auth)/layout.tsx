export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold text-ink tracking-tight">MAX</h1>
          <p className="text-lg text-ink/70 mt-2">
            A safe space to talk, reflect, and find support.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
