import { ChatInterface } from "@/features/chat/components/chat-interface";
import { getOrCreateConversation, loadChatHistory } from "@/features/chat/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Chat | MAX",
  description: "Talk to MAX",
};

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  const conversation = await getOrCreateConversation(session.user.id);
  const rawMessages = await loadChatHistory(conversation.id);

  // Map to Vercel AI SDK format
  const initialMessages = rawMessages.map(m => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));

  return <ChatInterface initialMessages={initialMessages} />;
}
