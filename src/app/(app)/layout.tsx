export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[#FAF9F6]">
      {/* We use a specific off-white for the root if surface is different, 
          but usually bg-surface covers it. Let's use bg-surface class. */}
      <div className="h-full w-full bg-surface">
        {/* Simple header */}
        <header className="h-16 flex items-center px-4 sm:px-8 border-b border-ink/5">
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold tracking-tight text-ink">MAX</h1>
          </div>
          <div className="text-sm font-medium text-signal">
            Urgent Help
          </div>
        </header>
        
        {/* Main content area */}
        <main className="h-[calc(100vh-4rem)] p-4 sm:p-6 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
