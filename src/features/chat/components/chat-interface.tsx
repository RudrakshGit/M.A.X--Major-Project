"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useTransition } from "react";
import { Send, Loader2, PanelLeft, MessageSquarePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CrisisCard } from "./crisis-card";
import { ChatHistorySidebar, ConversationItem } from "./chat-history-sidebar";
import { loadChatHistory, createNewConversation } from "../actions";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  initialConversations: ConversationItem[];
  activeConversation: ConversationItem;
  initialMessages?: UIMessage[];
  userId: string;
  companionName?: string;
}

export function ChatInterface({
  initialConversations,
  activeConversation: initialActiveConversation,
  initialMessages = [],
  userId,
  companionName = "M.A.X",
}: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<ConversationItem>(initialActiveConversation);
  const [currentMessages, setCurrentMessages] = useState<UIMessage[]>(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleSelectConversation = async (id: string) => {
    if (id === activeConversation.id) {
      setIsSidebarOpen(false);
      return;
    }
    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    setActiveConversation(target);
    setIsSidebarOpen(false);

    startTransition(async () => {
      try {
        const raw = await loadChatHistory(id);
        const mapped: UIMessage[] = raw.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant" | "system",
          parts: [{ type: "text" as const, text: m.content }],
        }));
        setCurrentMessages(mapped);
      } catch (err) {
        console.error("Failed to load conversation history", err);
      }
    });
  };

  const handleConversationCreated = (newConv: ConversationItem) => {
    setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)]);
    setActiveConversation(newConv);
    setCurrentMessages([]);
  };

  const handleConversationDeleted = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);

    if (activeConversation.id === id) {
      if (remaining.length > 0) {
        handleSelectConversation(remaining[0].id);
      } else {
        // Create a new one if none left
        startTransition(async () => {
          const fresh = await createNewConversation(userId);
          if (fresh) {
            handleConversationCreated(fresh);
          }
        });
      }
    }
  };

  const handleConversationRenamed = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date() } : c))
    );
    if (activeConversation.id === id) {
      setActiveConversation((prev) => ({ ...prev, title: newTitle }));
    }
  };

  return (
    <div className="flex h-full w-full max-w-5xl mx-auto rounded-xl shadow-xs border border-ink/5 bg-surface overflow-hidden">
      {/* Sidebar */}
      <ChatHistorySidebar
        conversations={conversations}
        activeConversationId={activeConversation.id}
        onSelectConversation={handleSelectConversation}
        onConversationCreated={handleConversationCreated}
        onConversationDeleted={handleConversationDeleted}
        onConversationRenamed={handleConversationRenamed}
        userId={userId}
        companionName={companionName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Chat Bar */}
        <div className="h-12 border-b border-ink/5 px-4 flex items-center justify-between gap-2 bg-surface">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="h-8 w-8 text-ink-muted hover:text-ink shrink-0"
              title="Toggle chat history"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold text-ink truncate max-w-[200px] sm:max-w-xs">
              {activeConversation.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {companionName} is active
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const fresh = await createNewConversation(userId);
                if (fresh) handleConversationCreated(fresh);
              }}
              className="h-8 w-8 text-ink-muted hover:text-ink"
              title="New Chat"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dynamic Chat Messages & Input */}
        <ChatStreamArea
          key={activeConversation.id}
          conversationId={activeConversation.id}
          initialMessages={currentMessages}
          companionName={companionName}
          onFirstMessageSent={(text) => {
            if (activeConversation.title.startsWith("Chat with ") || activeConversation.title === "Conversation") {
              const autoTitle = text.slice(0, 40).trim();
              handleConversationRenamed(activeConversation.id, autoTitle);
            }
          }}
        />
      </div>
    </div>
  );
}

function ChatStreamArea({
  conversationId,
  initialMessages,
  companionName,
  onFirstMessageSent,
}: {
  conversationId: string;
  initialMessages: UIMessage[];
  companionName: string;
  onFirstMessageSent: (text: string) => void;
}) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
    }),
    messages: initialMessages,
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (messages.length === 0) {
      onFirstMessageSent(input);
    }

    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, error]);

  const hasCrisisError = messages.some((m) =>
    (m as unknown as { parts?: Array<{ type: string }> }).parts?.some(
      (part) => part.type === "data-crisis"
    )
  );
  const isGenerating = status === "submitted" || status === "streaming";

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-6">
      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-ink/70 py-12">
            <div className="w-12 h-12 rounded-full bg-clay/10 text-clay flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-semibold text-ink">Hi, I&apos;m {companionName}.</p>
              <p className="text-xs sm:text-sm text-ink-muted max-w-sm">
                I&apos;m your safe, confidential space. Share whatever is on your mind today—whether it&apos;s exam stress, feeling low, or just needing to vent.
              </p>
            </div>
          </div>
        )}

        {messages.map((m) => {
          const msg = m as unknown as { content?: string; parts?: Array<{ type: string; text?: string }> };
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col max-w-[85%]",
                isUser ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isUser
                    ? "bg-ink text-surface rounded-br-xs font-normal"
                    : "bg-ink/5 text-ink rounded-bl-xs"
                )}
              >
                {msg.parts?.map((part, index: number) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.text}</span>;
                  }
                  return null;
                }) || msg.content}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-ink/50 mr-auto py-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">{companionName} is listening &amp; typing...</span>
          </div>
        )}

        {hasCrisisError && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CrisisCard />
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative mt-auto flex items-center bg-surface-card border border-ink/10 rounded-full shadow-xs pr-1.5 transition-all focus-within:border-ink/30 focus-within:ring-2 focus-within:ring-ink/5"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={hasCrisisError ? "Session paused" : `Message ${companionName}...`}
          disabled={hasCrisisError || isGenerating}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-5 py-5 text-sm shadow-none placeholder:text-ink-muted"
        />
        <Button
          type="submit"
          size="icon"
          disabled={hasCrisisError || isGenerating || !input.trim()}
          className="rounded-full h-9 w-9 shrink-0 bg-ink hover:bg-ink/90 text-surface transition-transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>

      <div className="text-center mt-2.5">
        <p className="text-[11px] text-ink-muted">
          {companionName} is an AI companion for emotional support and not a medical doctor. In crisis, please use Urgent Help.
        </p>
      </div>
    </div>
  );
}
