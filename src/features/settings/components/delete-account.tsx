"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "../actions";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

export function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Failed to delete account", error);
      setIsDeleting(false);
    }
  }

  if (!showConfirm) {
    return (
      <Button variant="outline" className="text-signal border-signal/30 hover:bg-signal/10 hover:text-signal" onClick={() => setShowConfirm(true)}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete My Account
      </Button>
    );
  }

  return (
    <div className="bg-signal/10 border border-signal/30 p-4 rounded-xl space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-signal shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-signal">Are you sure?</h4>
          <p className="text-sm text-ink-muted mt-1">
            This will permanently delete your account, journals, check-ins, and all companion memories. This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Yes, Delete Everything
        </Button>
        <Button variant="ghost" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
