export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight">MAX</h1>
        <p className="text-ink-muted text-lg leading-relaxed">
          A stigma-free mental health support system for students in higher education.
          This page proves the design tokens are working.
        </p>
      </div>

      <div className="bg-surface-card rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold">Conditions</h2>
        <div className="flex flex-wrap gap-2">
          <span className="bg-clay/20 text-clay px-3 py-1 rounded-full text-sm font-medium">Anxiety</span>
          <span className="bg-sage/20 text-sage px-3 py-1 rounded-full text-sm font-medium">Depression</span>
          <span className="bg-sand/20 text-sand px-3 py-1 rounded-full text-sm font-medium">Burnout</span>
          <span className="bg-sky/20 text-sky px-3 py-1 rounded-full text-sm font-medium">Sleep</span>
          <span className="bg-dusk/20 text-dusk px-3 py-1 rounded-full text-sm font-medium">Academic stress</span>
        </div>
      </div>

      <div className="pt-8">
        <a href="#" className="text-signal font-semibold hover:underline">
          Urgent help
        </a>
      </div>
    </main>
  );
}
