"use client";

import { useState, useTransition } from "react";
import { ClipboardList, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle, ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instruments, scorePHQ9, scoreGAD7, scoreCBI, Screener } from "@/content/screeners";
import { submitScreenerRun } from "@/features/assessments/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InChatScreenerCardProps {
  initialInstrumentId?: string;
  onDismiss?: () => void;
  onCompleted?: (result: { instrument: string; score: number; band: string }) => void;
}

export function InChatScreenerCard({
  initialInstrumentId = "phq9",
  onDismiss,
  onCompleted,
}: InChatScreenerCardProps) {
  const [selectedId, setSelectedId] = useState<string>(initialInstrumentId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<{ total: number; band: string } | null>(null);
  const [, startTransition] = useTransition();

  const screener: Screener = instruments[selectedId] || instruments.phq9;
  const currentQuestion = screener.questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex) / screener.questions.length) * 100);

  const handleSelectOption = (score: number) => {
    const updated = [...responses];
    updated[currentQuestionIndex] = score;
    setResponses(updated);

    if (currentQuestionIndex + 1 < screener.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate score and submit
      let calculated = { total: 0, band: "" };
      if (selectedId === "phq9") calculated = scorePHQ9(updated);
      else if (selectedId === "gad7") calculated = scoreGAD7(updated);
      else if (selectedId === "cbi") calculated = scoreCBI(updated);

      setResult(calculated);
      setIsCompleted(true);

      startTransition(async () => {
        try {
          await submitScreenerRun(selectedId, updated, calculated.total, calculated.band);
          if (onCompleted) {
            onCompleted({
              instrument: selectedId,
              score: calculated.total,
              band: calculated.band,
            });
          }
        } catch (err) {
          console.error("Failed to submit screener run from chat", err);
        }
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSwitchInstrument = (id: string) => {
    setSelectedId(id);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsCompleted(false);
    setResult(null);
  };

  // Check if severe risk flag is present (e.g. PHQ9 question 9 positive or severe band)
  const isSevere = result?.band.toLowerCase().includes("severe");
  const hasSelfHarmPositive = selectedId === "phq9" && responses[8] && responses[8] > 0;

  if (isCompleted && result) {
    return (
      <div className="my-3 p-4 rounded-xl bg-surface-card border border-ink/10 shadow-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-ink/5 pb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{screener.title} Completed</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-ink-muted hover:text-ink p-1 rounded hover:bg-ink/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Result Band */}
        <div className="p-3.5 rounded-lg bg-surface border border-ink/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-muted">Assessment Band</span>
            <span className="text-xs font-bold text-ink px-2.5 py-0.5 rounded-full bg-clay/15 text-ink border border-clay/30">
              {result.band}
            </span>
          </div>
          <div className="flex items-baseline gap-1 text-ink">
            <span className="text-2xl font-bold font-display">{result.total}</span>
            <span className="text-xs text-ink-muted">
              / {selectedId === "phq9" ? 27 : selectedId === "gad7" ? 21 : 100} points
            </span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            This score provides a private snapshot of your recent symptoms. It is safe, confidential, and not a medical verdict.
          </p>
        </div>

        {/* Crisis Guidance if severe */}
        {(isSevere || hasSelfHarmPositive) && (
          <div className="p-3 rounded-lg bg-signal/10 border border-signal/30 text-ink space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-signal">
              <AlertTriangle className="w-4 h-4" />
              <span>We recommend connecting with support</span>
            </div>
            <p className="text-xs text-ink-muted">
              Your responses indicate elevated distress. Reaching out to a counselor or student helpline can provide safe, supportive guidance.
            </p>
            <Link
              href="/referrals"
              className="inline-flex items-center gap-1 text-xs font-semibold text-signal hover:underline"
            >
              View Free &amp; Confidential Helplines <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Link
            href="/resources"
            className="text-xs text-ink font-medium hover:underline flex items-center gap-1"
          >
            Explore coping resources <ArrowRight className="w-3 h-3" />
          </Link>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSwitchInstrument(selectedId)}
            className="text-xs h-8 bg-ink text-surface hover:bg-ink/90 font-semibold"
          >
            Retake Check-in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 rounded-xl bg-surface-card border border-ink/10 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-ink/5 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <ClipboardList className="w-4 h-4 text-clay" />
          <span>Mental Health Check-in</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-clay" /> 100% Private
          </span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-ink-muted hover:text-ink p-1 rounded hover:bg-ink/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Instrument Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface p-1 rounded-lg border border-ink/5 text-center">
        {[
          { id: "phq9", label: "Depression (PHQ-9)" },
          { id: "gad7", label: "Anxiety (GAD-7)" },
          { id: "cbi", label: "Burnout (CBI)" },
        ].map((tab) => {
          const isSelected = selectedId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSwitchInstrument(tab.id)}
              className={cn(
                "text-[11px] font-medium py-1 px-1 rounded-md transition-all truncate",
                isSelected
                  ? "bg-ink text-surface font-semibold shadow-2xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Progress Bar & Counter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>Question {currentQuestionIndex + 1} of {screener.questions.length}</span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-clay transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(progressPercent, 5)}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="p-3 rounded-lg bg-surface border border-ink/5 space-y-1">
        <p className="text-[11px] font-medium text-ink-muted">
          Over the last 2 weeks, how often have you felt:
        </p>
        <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
          &ldquo;{currentQuestion.text}&rdquo;
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-1.5">
        {screener.options.map((option) => {
          const isCurrentSelected = responses[currentQuestionIndex] === option.score;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => handleSelectOption(option.score)}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-all text-left group",
                isCurrentSelected
                  ? "bg-ink text-surface border-ink shadow-xs"
                  : "bg-surface border-ink/10 hover:border-ink/25 text-ink hover:bg-ink/5"
              )}
            >
              <span>{option.text}</span>
              <ChevronRight className={cn("w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5", isCurrentSelected ? "text-surface" : "text-ink-muted")} />
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="text-xs text-ink-muted h-7 px-2"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
        </Button>
        <span className="text-[10px] text-ink-muted">
          Click an option to proceed
        </span>
      </div>
    </div>
  );
}
