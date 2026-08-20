"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { saveJournalEntry } from "../actions";

const MOODS = [
  { id: "terrible", emoji: "😭", label: "Terrible" },
  { id: "bad", emoji: "🙁", label: "Bad" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "great", emoji: "🤩", label: "Great" },
];

export function MoodLogger() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await saveJournalEntry(selectedMood, content.trim() || undefined);
      // Reset form on success
      setSelectedMood(null);
      setContent("");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-display font-bold text-ink mb-6">How are you feeling?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mood Selector */}
        <div className="flex justify-between sm:justify-start sm:gap-6">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                selectedMood === mood.id
                  ? "bg-ink/10 scale-110"
                  : "hover:bg-ink/5 grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-ink">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Optional Journal */}
        <div className="space-y-3">
          <label htmlFor="journal-note" className="text-sm font-medium text-ink/70">
            Care to elaborate? (Optional)
          </label>
          <Textarea
            id="journal-note"
            placeholder="Jot down what's on your mind..."
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            className="resize-none h-24 bg-transparent focus-visible:ring-ink"
          />
        </div>

        <Button 
          type="submit" 
          disabled={!selectedMood || isSubmitting}
          className="w-full sm:w-auto rounded-full px-8 bg-ink hover:bg-ink/90 text-surface"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log Mood
        </Button>
      </form>
    </div>
  );
}
