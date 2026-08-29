import { streamText } from "ai";
import { model } from "@/ai/provider";
import { buildSystemPrompt } from "@/ai/prompt";
import { classifyRisk } from "@/safety/classifier";
import { inspectOutput, GUARD_FALLBACK } from "@/safety/guard";
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

    // The reply is generated in full, checked, and only then sent. Guarding
    // inside onFinish would run after the text had already streamed to the
    // browser, which is recording a violation rather than preventing one.
    // docs/safety.md requires a failing reply to be replaced.
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
    });

    const generated = await result.text;
    const verdict = inspectOutput(generated);
    const reply = verdict.safe ? generated : GUARD_FALLBACK;

    if (!verdict.safe) {
      // Reason code only. Safety records never carry message content.
      console.warn(JSON.stringify({
        event: "safety.output_guard.blocked",
        code: verdict.code,
        conversationId: conversation.id,
      }));
    }

    await saveMessage(conversation.id, "assistant", reply);

    generateMemorySummary(userId, conversation.id).catch((err) => {
      console.error("Failed background memory summary", err);
    });

    return new Response(reply, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
