import { journeys } from "@/content/journeys";
import { getUserJourneys } from "@/features/journeys/actions";
import { JourneyCard } from "@/features/journeys/components/journey-card";

export const metadata = {
  title: "Journeys | M.A.X",
  description: "Structured multi-day programs to help you build better habits and cope with distress.",
};

export default async function JourneysCatalogPage() {
  const enrolments = await getUserJourneys();
  
  // Map enrolments by journeyId for easy lookup
  const enrolmentMap = new Map(enrolments.map(e => [e.journeyId, e]));

  const allJourneys = Object.values(journeys);
  const enrolledJourneys = allJourneys.filter(j => enrolmentMap.has(j.id));
  const availableJourneys = allJourneys.filter(j => !enrolmentMap.has(j.id));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            Journeys
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            Multi-day courses designed to help you take small, actionable steps towards feeling better.
          </p>
        </div>

        {enrolledJourneys.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-ink">Your Active Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledJourneys.map(journey => (
                <JourneyCard 
                  key={journey.id} 
                  journey={journey} 
                  enrolment={enrolmentMap.get(journey.id)} 
                />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-ink">Explore Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJourneys.map(journey => (
              <JourneyCard 
                key={journey.id} 
                journey={journey} 
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
