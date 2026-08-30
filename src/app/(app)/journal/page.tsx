import { getJournalHistory } from "@/features/journal/actions";
import { MoodLogger } from "@/features/journal/components/mood-logger";
import { JournalHistory } from "@/features/journal/components/journal-history";

export const metadata = {
  title: "Journal | M.A.X",
  description: "Track your mood and thoughts.",
};

export default async function JournalPage() {
  const entries = await getJournalHistory();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-2xl mx-auto space-y-12">
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">Your Journal</h1>
          <p className="text-ink/70">
            Check in with yourself. Tracking your mood over time can help identify patterns and triggers.
          </p>
        </div>

        <MoodLogger />

        <JournalHistory entries={entries} />

      </div>
    </div>
  );
}
