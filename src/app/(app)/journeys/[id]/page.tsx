import { journeys } from "@/content/journeys";
import { getUserJourneys, enrollInJourney } from "@/features/journeys/actions";
import { JourneyDayView } from "@/features/journeys/components/journey-day-view";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journey = journeys[id];
  if (!journey) return { title: "Not Found" };
  return { title: `${journey.title} | MAX Journeys` };
}

export default async function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journey = journeys[id];
  if (!journey) {
    notFound();
  }

  const enrolments = await getUserJourneys();
  const enrolment = enrolments.find(e => e.journeyId === journey.id);
  const isEnrolled = !!enrolment;
  const isCompleted = enrolment?.completedAt != null;
  const currentDayNum = enrolment?.currentDay || 1;

  // We need a server action wrapper to handle the form submission for enrollment
  async function handleEnroll() {
    "use server";
    await enrollInJourney(journey.id);
    redirect(`/journeys/${journey.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link 
          href="/journeys" 
          className="inline-flex items-center text-sm font-semibold text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journeys
        </Link>

        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60 mb-2">
            5-Day Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            {journey.title}
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            {journey.description}
          </p>
        </div>

        {!isEnrolled ? (
          <div className="bg-surface rounded-2xl p-8 border border-ink/5 shadow-sm text-center space-y-6">
            <p className="text-ink/80 text-lg">
              Ready to start this journey? It will take 5 days to complete.
            </p>
            <form action={handleEnroll}>
              <Button type="submit" size="lg" className="rounded-full px-8 bg-ink text-surface hover:bg-ink/90">
                Enroll Now
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Timeline Sidebar */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-bold text-ink mb-6">Course Outline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-ink/10">
                {journey.days.map((day) => {
                  const isPast = day.day < currentDayNum || isCompleted;
                  const isActive = day.day === currentDayNum && !isCompleted;

                  return (
                    <div key={day.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-surface bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {isPast ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 bg-surface rounded-full" />
                        ) : isActive ? (
                          <div className="w-2.5 h-2.5 bg-ink rounded-full" />
                        ) : (
                          <Lock className="w-3 h-3 text-ink/30" />
                        )}
                      </div>
                      
                      <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border ${
                        isActive ? "bg-surface border-ink/20 shadow-sm" : "border-transparent"
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isActive ? "text-ink" : "text-ink/50"}`}>
                            Day {day.day}
                          </span>
                        </div>
                        <h4 className={`font-semibold text-sm ${isPast ? "text-ink/70" : isActive ? "text-ink" : "text-ink/40"}`}>
                          {day.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Day Content */}
            <div className="md:col-span-8">
              {isCompleted ? (
                <div className="bg-surface rounded-2xl p-12 shadow-sm border border-ink/5 text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-green-600/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-ink">Journey Complete!</h2>
                  <p className="text-ink/70 text-lg">
                    You&apos;ve successfully finished all 5 days of this journey.
                  </p>
                  <div className="pt-4">
                    <Link href="/journeys">
                      <Button variant="outline" className="rounded-full">
                        Explore other journeys
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <JourneyDayView 
                  day={journey.days[currentDayNum - 1]} 
                  enrolmentId={enrolment.id}
                  isCompleted={false}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(journeys).map((id) => ({
    id,
  }));
}
