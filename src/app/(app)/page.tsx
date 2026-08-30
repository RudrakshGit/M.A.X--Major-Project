import { ChatInterface } from "@/features/chat/components/chat-interface";
import { getOrCreateConversation, loadChatHistory, getUserConversations, getCompanionSettings } from "@/features/chat/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Chat | M.A.X",
  description: "Talk to M.A.X — Your empathetic student mental health companion",
};

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const [conversations, companionSettings] = await Promise.all([
    getUserConversations(session.user.id),
    getCompanionSettings(session.user.id),
  ]);

  const activeConversation = await getOrCreateConversation(session.user.id);
  const rawMessages = await loadChatHistory(activeConversation.id);

  // Map to Vercel AI SDK format
  const initialMessages = rawMessages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));

  // Ensure activeConversation is present in the list
  const conversationList = conversations.length > 0 ? conversations : [activeConversation];

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full w-full">
      <ChatInterface
        initialConversations={conversationList}
        activeConversation={activeConversation}
        initialMessages={initialMessages}
        userId={session.user.id}
        companionName={companionSettings?.name || "M.A.X"}
      />
    </div>
  );
}
