import { Journey } from "@/content/journeys";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type JourneyEnrolment = {
  id: string;
  journeyId: string;
  currentDay: number;
  completedAt: Date | null;
};

export function JourneyCard({ 
  journey, 
  enrolment 
}: { 
  journey: Journey;
  enrolment?: JourneyEnrolment;
}) {
  const isCompleted = enrolment?.completedAt != null;
  const totalDays = journey.days.length;
  const progressPercent = enrolment ? (enrolment.currentDay / totalDays) * 100 : 0;

  return (
    <Link href={`/journeys/${journey.id}`} className="block group">
      <div className="h-full bg-surface p-6 rounded-2xl border border-ink/5 hover:border-ink/20 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
        
        {isCompleted && (
          <div className="absolute top-4 right-4 text-green-600/80">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        )}

        <h3 className="text-xl font-bold font-display text-ink mb-2 pr-8 group-hover:text-ink/80 transition-colors">
          {journey.title}
        </h3>
        <p className="text-ink/70 text-sm mb-6 leading-relaxed line-clamp-2">
          {journey.description}
        </p>

        {enrolment && !isCompleted ? (
          <div className="mt-auto space-y-2">
            <div className="flex justify-between text-xs font-medium text-ink/60">
              <span>Day {enrolment.currentDay} of {totalDays}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-ink rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors mt-auto">
            {isCompleted ? "Review Journey" : "Start Journey"} 
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </Link>
  );
}
