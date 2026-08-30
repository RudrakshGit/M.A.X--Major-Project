"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, BookmarkPlus, Sparkles, Loader2, ExternalLink, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveJournalEntry } from "@/features/journal/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MOODS = [
  { id: "terrible", value: "1", emoji: "😭", label: "Very Low" },
  { id: "bad", value: "2", emoji: "🙁", label: "Down" },
  { id: "okay", value: "3", emoji: "😐", label: "Neutral" },
  { id: "good", value: "4", emoji: "🙂", label: "Good" },
  { id: "great", value: "5", emoji: "🤩", label: "Great" },
];

const SUGGESTED_TAGS = [
  "Exam Stress",
  "Anxiety",
  "Hostel Life",
  "Burnout",
  "Tired",
  "Lonely",
  "Productive",
  "Hopeful",
  "Grateful",
];

interface InChatJournalCardProps {
  initialMood?: string;
  initialSummary?: string;
  initialTags?: string[];
  onDismiss?: () => void;
  onSaved?: () => void;
}

export function InChatJournalCard({
  initialMood = "okay",
  initialSummary = "",
  initialTags = [],
  onDismiss,
  onSaved,
}: InChatJournalCardProps) {
  // Normalize initial mood to valid id
  const normalizedInitial = (() => {
    if (initialMood === "1") return "terrible";
    if (initialMood === "2" || initialMood === "low" || initialMood === "down") return "bad";
    if (initialMood === "3" || initialMood === "neutral") return "okay";
    if (initialMood === "4") return "good";
    if (initialMood === "5") return "great";
    return initialMood;
  })();

  const [selectedMood, setSelectedMood] = useState<string>(normalizedInitial);
  const [content, setContent] = useState(initialSummary);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [customTagInput, setCustomTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customTagInput.trim().replace(/^#/, "");
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags((prev) => [...prev, clean]);
    }
    setCustomTagInput("");
    setIsAddingTag(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const fullContent = selectedTags.length > 0
          ? `${content.trim()}${content.trim() ? "\n\n" : ""}Tags: ${selectedTags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`
          : content.trim();

        await saveJournalEntry(selectedMood, fullContent || undefined);
        setIsSaved(true);
        if (onSaved) onSaved();
      } catch (err) {
        console.error("Failed to save journal entry from chat", err);
      }
    });
  };

  if (isSaved) {
    return (
      <div className="my-3 p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Saved to your Mood Journal!</p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                You can review past reflections anytime in your Journal.
              </p>
            </div>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
          >
            View Journal <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 rounded-xl bg-surface-card border border-ink/10 shadow-xs space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-ink/5 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <BookmarkPlus className="w-4 h-4 text-clay" />
          <span>Log Reflection to Journal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-clay" /> Private &amp; confidential
          </span>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-ink-muted hover:text-ink p-0.5 rounded hover:bg-ink/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mood Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-ink-muted block">
          How are you feeling right now?
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-1 rounded-lg border text-center transition-all",
                  isSelected
                    ? "bg-ink text-surface border-ink shadow-xs scale-[1.02]"
                    : "bg-surface border-ink/10 hover:border-ink/20 text-ink/80"
                )}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-medium mt-0.5 truncate w-full">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-ink-muted block">
          Feelings &amp; Triggers (Optional)
        </label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {SUGGESTED_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "text-[11px] px-2.5 py-1 rounded-full border transition-all",
                  isSelected
                    ? "bg-clay text-white border-clay font-medium"
                    : "bg-surface border-ink/10 text-ink/70 hover:border-ink/20"
                )}
              >
                #{tag}
              </button>
            );
          })}

          {selectedTags
            .filter((t) => !SUGGESTED_TAGS.includes(t))
            .map((customTag) => (
              <button
                key={customTag}
                type="button"
                onClick={() => toggleTag(customTag)}
                className="text-[11px] px-2.5 py-1 rounded-full border bg-clay text-white border-clay font-medium flex items-center gap-1"
              >
                #{customTag} <X className="w-2.5 h-2.5" />
              </button>
            ))}

          {isAddingTag ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTag();
                  } else if (e.key === "Escape") {
                    setIsAddingTag(false);
                  }
                }}
                placeholder="Tag name..."
                autoFocus
                className="h-6 text-[11px] w-24 px-2 bg-surface"
              />
              <button
                type="button"
                onClick={() => handleAddCustomTag()}
                className="text-[10px] bg-ink text-surface px-1.5 py-0.5 rounded"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-ink/20 text-ink/60 hover:text-ink hover:border-ink/40 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Custom
            </button>
          )}
        </div>
      </div>

      {/* Note Textarea */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-ink-muted block">
          Reflection Note
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a few words about what's making you feel this way..."
          rows={2}
          className="text-xs bg-surface border-ink/10 focus-visible:ring-1 focus-visible:ring-ink/20 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            disabled={isPending}
            className="text-xs text-ink-muted h-8"
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isPending}
          className="text-xs bg-ink hover:bg-ink/90 text-surface h-8 px-4 font-semibold gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save to Journal
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
