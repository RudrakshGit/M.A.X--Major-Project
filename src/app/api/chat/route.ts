import { streamText } from "ai";
import { model } from "@/ai/provider";
import { buildSystemPrompt } from "@/ai/prompt";
import { classifyRisk } from "@/safety/classifier";
import { guardOutput } from "@/safety/guard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getOrCreateConversation, saveMessage, getCompanionSettings, getMemorySummary } from "@/features/chat/actions";
import { generateMemorySummary } from "@/ai/memory";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages.filter((m: {role: string, content: string}) => m.role === "user").pop();

    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const conversation = await getOrCreateConversation(userId);
    const companionSettings = await getCompanionSettings(userId);
    const memoryResult = await getMemorySummary(userId);

    let isDistress = false;

    if (lastUserMessage) {
      const risk = classifyRisk(lastUserMessage.content);
      
      if (risk.level === "crisis") {
        await saveMessage(conversation.id, "user", lastUserMessage.content, "crisis");
        return new Response(
          JSON.stringify({ error: "crisis_detected" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (risk.level === "distress") {
        isDistress = true;
      }

      await saveMessage(conversation.id, "user", lastUserMessage.content, risk.level);
    }

    const systemPrompt = buildSystemPrompt({
      companionName: companionSettings.name,
      distressDetected: isDistress,
      contextSummary: memoryResult?.summary
    });

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        if (!guardOutput(text)) {
          console.warn("Safety violation: Output guard blocked response.", text);
          // In a buffered implementation, we would replace the text.
          // Since it's streaming, we log the violation to audit later.
        }
        
        await saveMessage(conversation.id, "assistant", text);

        // Fire and forget summarization
        generateMemorySummary(userId, conversation.id).catch(err => {
          console.error("Failed background memory summary", err);
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
