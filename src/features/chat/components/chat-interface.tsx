"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CrisisCard } from "./crisis-card";
import { cn } from "@/lib/utils";

export function ChatInterface({ initialMessages = [] }: { initialMessages?: UIMessage[] }) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: initialMessages,
  });
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, error]);

  const hasCrisisError = error && error.message.includes("crisis_detected");
  const isGenerating = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4 sm:p-8 bg-surface rounded-xl shadow-sm border border-ink/5">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2"
      >
        {messages.length === 0 && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-ink/70">
            <p className="text-lg font-medium text-ink">Hi, I&apos;m MAX.</p>
            <p className="max-w-md">I&apos;m here to listen. You can talk to me about whatever is on your mind today.</p>
          </div>
        )}

        {messages.map((m) => {
          const msg = m as unknown as { content?: string; parts?: Array<{ type: string; text?: string }> };
          return (
            <div 
              key={m.id} 
              className={cn(
                "flex flex-col max-w-[85%]",
                m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div 
                className={cn(
                  "px-4 py-3 rounded-2xl",
                  m.role === "user" 
                    ? "bg-ink text-surface rounded-br-sm" 
                    : "bg-ink/5 text-ink rounded-bl-sm"
                )}
              >
                {msg.parts?.map((part, index: number) => {
                  if (part.type === 'text') {
                    return <span key={index}>{part.text}</span>;
                  }
                  return null;
                }) || msg.content}
              </div>
            </div>
          );
        })}
        
        {isGenerating && (
          <div className="flex items-center space-x-2 text-ink/50 mr-auto">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">MAX is typing...</span>
          </div>
        )}

        {hasCrisisError && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CrisisCard />
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="relative mt-auto flex items-center bg-surface-card border border-ink/10 rounded-full shadow-sm pr-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={hasCrisisError ? "Session paused" : "Message MAX..."}
          disabled={hasCrisisError || isGenerating}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-6 text-base shadow-none"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={hasCrisisError || isGenerating || !input.trim()}
          className="rounded-full h-10 w-10 shrink-0 bg-ink hover:bg-ink/90 text-surface"
        >
          <Send className="w-4 h-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
      <div className="text-center mt-3">
        <p className="text-xs text-ink/50">MAX is an AI and cannot handle emergencies. In a crisis, reach out to a human helpline.</p>
      </div>
    </div>
  );
}
