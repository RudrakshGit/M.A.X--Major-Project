import Link from "next/link";
import { instruments } from "@/content/screeners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Check in | M.A.X",
  description: "Short, private questionnaires you can take any time.",
};

export default function AssessmentsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Check in</h1>
      <p className="mt-2 max-w-xl text-ink-muted">
        Short questionnaires that help you see how you have been doing. They are
        private, they take a couple of minutes, and they are not a diagnosis.
      </p>

      <div className="mt-8 space-y-4">
        {Object.values(instruments).map((screener) => (
          <Link key={screener.id} href={`/assessments/${screener.id}`} className="block">
            <Card className="transition-colors hover:bg-surface-card">
              <CardHeader>
                <CardTitle className="font-display text-lg text-ink">{screener.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-muted">{screener.description}</p>
                <p className="mt-3 text-sm font-medium text-ink">
                  {screener.questions.length} questions
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        These give you a band, not a verdict. If a result worries you, talk to
        someone — the <Link href="/referrals" className="underline underline-offset-4">urgent help</Link> page lists free, confidential lines.
      </p>
    </div>
  );
}
