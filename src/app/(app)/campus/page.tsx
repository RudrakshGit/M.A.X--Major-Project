import { getCampusAggregates } from "@/features/institution/actions";
import { MINIMUM_COHORT_SIZE } from "@/features/institution/validators";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Lock, Users, AlertCircle, LineChart, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Campus Dashboard | M.A.X",
};

export default async function CampusDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin" || !session.user.institutionId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Lock className="w-16 h-16 text-ink/20 mb-6" />
        <h1 className="text-3xl font-display font-bold text-ink mb-2">Access Restricted</h1>
        <p className="text-ink/60 text-center max-w-md">
          You do not have the necessary administrator permissions to view this dashboard.
        </p>
      </div>
    );
  }

  let aggregates;
  let errorMsg = null;

  try {
    aggregates = await getCampusAggregates(session.user.institutionId);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "INSUFFICIENT_DATA") {
      errorMsg = "INSUFFICIENT_DATA";
    } else {
      errorMsg = "UNKNOWN_ERROR";
    }
  }

  if (errorMsg === "INSUFFICIENT_DATA") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60 mb-2">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Privacy First
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
              Campus Dashboard
            </h1>
            <p className="text-lg text-ink/70 leading-relaxed">
              Real-time, aggregated mental health analytics for your institution.
            </p>
          </div>

          <div className="bg-signal/10 border border-signal/30 rounded-2xl p-8 flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-signal mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">Insufficient Data</h2>
            <p className="text-ink/80 max-w-md">
              To protect individual student privacy, we enforce a strict minimum cohort size of {MINIMUM_COHORT_SIZE} active users. Your institution currently does not meet this threshold.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!aggregates) {
    return <div>Something went wrong.</div>;
  }

  // Calculate some display metrics
  const phq9Total = aggregates.phq9Distribution.reduce((acc, curr) => acc + curr.count, 0);
  const severeDepressionCount = aggregates.phq9Distribution.find(d => d.band === "Severe")?.count || 0;
  const severePercent = phq9Total > 0 ? ((severeDepressionCount / phq9Total) * 100).toFixed(1) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success mb-2">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Aggregated & Anonymized
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            Campus Dashboard
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            High-level mental health analytics for your institution. No personally identifiable information (PII) is ever exposed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center gap-3 text-ink/60 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Active Enrolled Students</h3>
            </div>
            <div className="text-4xl font-bold font-display text-ink">
              {aggregates.totalStudents}
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center gap-3 text-ink/60 mb-4">
              <LineChart className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Average Mood Score</h3>
            </div>
            <div className="text-4xl font-bold font-display text-ink">
              {aggregates.moodStats.averageScore ? aggregates.moodStats.averageScore.toFixed(1) : "-"}
              <span className="text-lg text-ink/40 ml-1">/ 5</span>
            </div>
            <p className="text-xs text-ink/50 mt-2">Based on {aggregates.moodStats.totalCheckIns} recent check-ins</p>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center gap-3 text-ink/60 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Severe PHQ-9 Markers</h3>
            </div>
            <div className="text-4xl font-bold font-display text-signal">
              {severePercent}%
            </div>
            <p className="text-xs text-ink/50 mt-2">Of total recent depression screenings</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-ink/5 shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-display text-ink">PHQ-9 Depression Severity Distribution</h3>
          <div className="space-y-4">
            {aggregates.phq9Distribution.map(dist => (
              <div key={dist.band} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-ink/80">{dist.band}</div>
                <div className="flex-1 h-3 bg-ink/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dist.band === "Severe" ? "bg-signal/100" : "bg-ink"}`}
                    style={{ width: `${(dist.count / phq9Total) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-bold text-ink/60">
                  {Math.round((dist.count / phq9Total) * 100)}%
                </div>
              </div>
            ))}
            {aggregates.phq9Distribution.length === 0 && (
              <div className="text-ink/50 text-sm">No PHQ-9 screenings recorded yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
