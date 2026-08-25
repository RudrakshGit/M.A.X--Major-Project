"use client";

import { JourneyDay } from "@/content/journeys";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, Loader2 } from "lucide-react";
import { useState } from "react";
import { completeJourneyDay } from "../actions";
import { useRouter } from "next/navigation";

export function JourneyDayView({ 
  day, 
  enrolmentId,
  isCompleted
}: { 
  day: JourneyDay;
  enrolmentId: string;
  isCompleted: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    if (isCompleted) return;
    
    setIsSubmitting(true);
    try {
      await completeJourneyDay(enrolmentId, day.day);
      router.refresh();
    } catch (error) {
      console.error("Failed to complete day:", error);
      setIsSubmitting(false); // only reset on error, on success we revalidate/navigate
    }
  }

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-ink/5 space-y-8 relative overflow-hidden">
      {isCompleted && (
        <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
          <CheckCircle2 className="w-32 h-32 text-ink" />
        </div>
      )}

      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60">
          Day {day.day}
        </div>
        <h2 className="text-3xl font-display font-bold text-ink">
          {day.title}
        </h2>
        <p className="text-lg text-ink/80 leading-relaxed max-w-prose">
          {day.content}
        </p>
      </div>

      <div className="bg-ink/5 rounded-xl p-6 border border-ink/10">
        <h3 className="text-xl font-bold font-display text-ink mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-ink/60" />
          Today&apos;s Action
        </h3>
        <p className="text-ink/80 leading-relaxed font-medium">
          {day.actionItem}
        </p>
      </div>

      <Button 
        onClick={handleComplete}
        disabled={isCompleted || isSubmitting}
        className={`w-full sm:w-auto rounded-full px-8 py-6 text-base ${
          isCompleted 
            ? "bg-green-600/10 text-green-700 hover:bg-green-600/10 opacity-100" 
            : "bg-ink hover:bg-ink/90 text-surface"
        }`}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isSubmitting && isCompleted && <CheckCircle2 className="mr-2 h-5 w-5" />}
        {isCompleted ? "Day Completed" : "Mark Day as Complete"}
      </Button>
    </div>
  );
}
