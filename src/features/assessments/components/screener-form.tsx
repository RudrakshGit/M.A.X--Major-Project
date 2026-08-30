"use client";

import { useState } from "react";
import { Screener, scorePHQ9, scoreGAD7, scoreCBI } from "@/content/screeners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitScreenerRun } from "../actions";
import { Loader2, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ScreenerForm({ screener }: { screener: Screener }) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ total: number; band: string } | null>(null);
  const [error, setError] = useState("");

  const isComplete = Object.keys(responses).length === screener.questions.length;

  const handleSelect = (questionId: string, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      // Map responses to an array in the order of questions
      const responseArray = screener.questions.map((q) => responses[q.id]);
      
      let calcResult = { total: 0, band: "" };
      if (screener.id === "phq9") {
        calcResult = scorePHQ9(responseArray);
      } else if (screener.id === "gad7") {
        calcResult = scoreGAD7(responseArray);
      } else if (screener.id === "cbi") {
        calcResult = scoreCBI(responseArray);
      }

      await submitScreenerRun(screener.id, responseArray, calcResult.total, calcResult.band);
      setResult(calcResult);
    } catch (err) {
      console.error(err);
      setError("Failed to save results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto mt-8 border-none shadow-sm bg-surface">
        <CardHeader>
          <CardTitle className="text-2xl text-ink font-display">Assessment Complete</CardTitle>
          <CardDescription>Thank you for completing the {screener.title}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-ink/5 rounded-xl border border-ink/10">
            <h3 className="text-sm font-medium text-ink/70 uppercase tracking-wider mb-2">Your Result Band</h3>
            <p className="text-3xl font-bold text-ink font-display">{result.band}</p>
            <p className="text-sm text-ink/70 mt-4">
              This is a standard reflection of your responses over the last 2 weeks. It is not a clinical diagnosis. 
              If you feel overwhelmed, please reach out to M.A.X or a campus counsellor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 mb-24 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display text-ink">{screener.title}</h1>
        <p className="text-ink/70">{screener.description}</p>
      </div>

      {error && (
        <div className="p-4 bg-signal/10 text-signal rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-12">
        {screener.questions.map((q, index) => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-lg font-medium text-ink">
              <span className="text-ink/40 mr-2">{index + 1}.</span> 
              {q.text}
            </h3>
            
            <RadioGroup 
              onValueChange={(val: string) => handleSelect(q.id, parseInt(val))}
              value={responses[q.id]?.toString()}
              className="grid gap-3 sm:grid-cols-2"
            >
              {screener.options.map((opt) => (
                <div key={`${q.id}-${opt.score}`} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={opt.score.toString()} 
                    id={`${q.id}-${opt.score}`} 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${q.id}-${opt.score}`}
                    className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-ink/5 peer-data-[state=checked]:border-ink peer-data-[state=checked]:bg-ink/5 [&:has([data-state=checked])]:border-ink cursor-pointer transition-all"
                  >
                    <span className="font-medium">{opt.text}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-ink/10 flex items-center justify-between sticky bottom-0 bg-surface pb-8">
        <p className="text-sm text-ink/60 font-medium">
          {Object.keys(responses).length} of {screener.questions.length} answered
        </p>
        <Button 
          onClick={handleSubmit} 
          disabled={!isComplete || isSubmitting}
          size="lg"
          className="rounded-full px-8 bg-ink hover:bg-ink/90 text-surface"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}
