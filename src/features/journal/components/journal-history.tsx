

const MOODS = {
  terrible: { emoji: "😭", label: "Terrible" },
  bad: { emoji: "🙁", label: "Bad" },
  okay: { emoji: "😐", label: "Okay" },
  good: { emoji: "🙂", label: "Good" },
  great: { emoji: "🤩", label: "Great" },
} as const;

type JournalEntry = {
  id: string;
  mood: string;
  content: string | null;
  createdAt: Date;
};

export function JournalHistory({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-ink/50">
        <p>No journal entries yet.</p>
        <p className="text-sm">Your history will appear here once you log a mood.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold text-ink">Recent History</h3>
      
      <div className="space-y-4">
        {entries.map((entry) => {
          const moodMeta = MOODS[entry.mood as keyof typeof MOODS] || MOODS.okay;
          
          return (
            <div key={entry.id} className="bg-surface p-5 rounded-xl border border-ink/5 shadow-sm flex gap-4">
              <div className="text-3xl shrink-0 pt-1">{moodMeta.emoji}</div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{moodMeta.label}</p>
                  <p className="text-xs text-ink/50 font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit"
                    }).format(new Date(entry.createdAt))}
                  </p>
                </div>
                {entry.content && (
                  <p className="text-ink/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
