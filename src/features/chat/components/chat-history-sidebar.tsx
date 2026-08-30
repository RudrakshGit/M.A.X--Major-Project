"use client";

import { useState, useTransition } from "react";
import { MessageSquarePlus, MessageSquare, Trash2, Edit2, Check, X, History, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createNewConversation, deleteConversation, renameConversation } from "../actions";

export type ConversationItem = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ChatHistorySidebarProps {
  conversations: ConversationItem[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onConversationCreated: (newConv: ConversationItem) => void;
  onConversationDeleted: (id: string) => void;
  onConversationRenamed: (id: string, newTitle: string) => void;
  userId: string;
  companionName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHistorySidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onConversationCreated,
  onConversationDeleted,
  onConversationRenamed,
  userId,
  companionName = "M.A.X",
  isOpen,
  onClose,
}: ChatHistorySidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleNewChat = () => {
    startTransition(async () => {
      try {
        const newConv = await createNewConversation(userId);
        if (newConv) {
          onConversationCreated(newConv);
          onSelectConversation(newConv.id);
        }
      } catch (err) {
        console.error("Failed to create new conversation", err);
      }
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      if (!confirm("Deleting this chat will create a fresh new chat. Proceed?")) return;
    } else {
      if (!confirm("Are you sure you want to delete this conversation?")) return;
    }

    startTransition(async () => {
      try {
        await deleteConversation(id, userId);
        onConversationDeleted(id);
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    });
  };

  const startEditing = (e: React.MouseEvent, conv: ConversationItem) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEditing = async (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }

    const titleToSave = editTitle.trim();
    setEditingId(null);
    startTransition(async () => {
      try {
        await renameConversation(id, userId, titleToSave);
        onConversationRenamed(id, titleToSave);
      } catch (err) {
        console.error("Failed to rename conversation", err);
      }
    });
  };

  // Group conversations by date
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;

  const todayList: ConversationItem[] = [];
  const pastWeekList: ConversationItem[] = [];
  const olderList: ConversationItem[] = [];

  conversations.forEach((conv) => {
    const convTime = new Date(conv.updatedAt).getTime();
    if (convTime >= today) {
      todayList.push(conv);
    } else if (convTime >= sevenDaysAgo) {
      pastWeekList.push(conv);
    } else {
      olderList.push(conv);
    }
  });

  const renderGroup = (title: string, items: ConversationItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <h4 className="px-2 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
          {title}
        </h4>
        {items.map((conv) => {
          const isActive = conv.id === activeConversationId;
          const isEditing = editingId === conv.id;

          if (isEditing) {
            return (
              <form
                key={conv.id}
                onSubmit={(e) => saveEditing(e, conv.id)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-surface-card border border-ink/20"
              >
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className="h-7 text-xs px-2 py-0"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => saveEditing(e, conv.id)}
                  className="h-6 w-6 text-green-600 hover:bg-green-50 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                  className="h-6 w-6 text-ink-muted hover:bg-ink/5 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </form>
            );
          }

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all",
                isActive
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink hover:bg-ink/5"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MessageSquare className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-surface" : "text-ink-muted")} />
                <span className="truncate">{conv.title}</span>
              </div>

              <div className={cn(
                "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                isActive && "opacity-100"
              )}>
                <button
                  type="button"
                  onClick={(e) => startEditing(e, conv)}
                  title="Rename"
                  className={cn(
                    "p-1 rounded hover:bg-black/10 transition-colors",
                    isActive ? "text-surface/80 hover:text-surface" : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, conv.id)}
                  title="Delete chat"
                  className={cn(
                    "p-1 rounded hover:bg-black/10 transition-colors",
                    isActive ? "text-surface/80 hover:text-red-300" : "text-ink-muted hover:text-red-500"
                  )}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink/20 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 md:w-64 bg-surface border-r border-ink/5 flex flex-col transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          !isOpen && "md:hidden"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-ink/5 flex items-center justify-between gap-2">
          <Button
            onClick={handleNewChat}
            disabled={isPending}
            title={`Start a new chat with ${companionName}`}
            className="flex-1 justify-start gap-2 bg-ink hover:bg-ink/90 text-surface text-xs h-9 rounded-lg"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-ink-muted hover:text-ink shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-ink-muted">
              <History className="w-6 h-6 mx-auto mb-2 opacity-40" />
              No previous chats yet.
            </div>
          ) : (
            <>
              {renderGroup("Today", todayList)}
              {renderGroup("Previous 7 Days", pastWeekList)}
              {renderGroup("Older", olderList)}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-ink/5 text-[11px] text-ink-muted text-center">
          Encrypted &amp; private session
        </div>
      </aside>
    </>
  );
}
