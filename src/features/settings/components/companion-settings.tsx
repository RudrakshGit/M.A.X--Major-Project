"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompanionSettings } from "@/features/chat/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CompanionSettings({ 
  userId, 
  initialName, 
  initialTone 
}: { 
  userId: string;
  initialName: string;
  initialTone: string;
}) {
  const [name, setName] = useState(initialName);
  const [tone, setTone] = useState(initialTone);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !tone.trim()) return;

    setIsSaving(true);
    try {
      await updateCompanionSettings(userId, name, tone);
      router.refresh();
    } catch (error) {
      console.error("Failed to update companion settings", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companion-name">Companion Name</Label>
          <Input 
            id="companion-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. M.A.X"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companion-tone">Companion Tone</Label>
          <select 
            id="companion-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="warm">Warm & Empathetic</option>
            <option value="direct">Direct & Solution-Focused</option>
            <option value="playful">Playful & Lighthearted</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSaving || (name === initialName && tone === initialTone)}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
