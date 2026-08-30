"use client";

import { useState, useTransition } from "react";
import { UserCheck, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCompanionSettings } from "@/features/chat/actions";
import { cn } from "@/lib/utils";

const POPULAR_NAMES = ["M.A.X", "Aarav", "Eva", "Josh", "Sam", "Riya", "Elena", "Kabir"];

interface InChatRenameCardProps {
  currentName: string;
  userId: string;
  onDismiss?: () => void;
  onNameUpdated?: (newName: string) => void;
}

export function InChatRenameCard({
  currentName,
  userId,
  onDismiss,
  onNameUpdated,
}: InChatRenameCardProps) {
  const [nameInput, setNameInput] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) {
      setErrorMsg("Please enter a name");
      return;
    }
    if (clean.length > 30) {
      setErrorMsg("Name must be 30 characters or less");
      return;
    }

    setErrorMsg("");
    startTransition(async () => {
      try {
        await updateCompanionSettings(userId, clean, "warm");
        setIsSaved(true);
        if (onNameUpdated) onNameUpdated(clean);
        setTimeout(() => {
          if (onDismiss) onDismiss();
        }, 1500);
      } catch (err) {
        console.error("Failed to update companion name", err);
        setErrorMsg("Failed to save. Please try again.");
      }
    });
  };

  if (isSaved) {
    return (
      <div className="my-2 p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">
            Companion renamed to <span className="font-bold text-emerald-800 dark:text-emerald-100">&ldquo;{nameInput.trim()}&rdquo;</span>!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 p-4 rounded-xl bg-surface-card border border-ink/10 shadow-xs space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-ink/5 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <UserCheck className="w-4 h-4 text-clay" />
          <span>Rename Your Companion</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-clay" /> Personalized for you
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

      <form onSubmit={handleSave} className="space-y-3">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-ink-muted block">
            What would you like to call your companion?
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="e.g. M.A.X, Aarav, Josh..."
              autoFocus
              className="h-9 text-xs bg-surface border-ink/10 focus-visible:ring-1 focus-visible:ring-ink/20 flex-1"
            />
            <Button
              type="submit"
              disabled={isPending || !nameInput.trim() || nameInput.trim() === currentName}
              className="h-9 px-4 text-xs font-semibold bg-ink hover:bg-ink/90 text-surface shrink-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Saving
                </>
              ) : (
                "Save Name"
              )}
            </Button>
          </div>
          {errorMsg && <p className="text-[10px] text-red-500 font-medium">{errorMsg}</p>}
        </div>

        {/* Popular suggestions */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-ink-muted block">
            Popular companion names:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setNameInput(name)}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-md border transition-all",
                  nameInput.trim() === name
                    ? "bg-ink text-surface border-ink font-semibold"
                    : "bg-surface border-ink/10 text-ink/70 hover:border-ink/25"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
