import { streamText, createUIMessageStream, createUIMessageStreamResponse } from "ai";
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
        // The model is never called. This used to be a 400 whose body the client
        // had to find inside an error string; when that failed, a student in
        // crisis saw nothing at all. A data part is part of the protocol, so it
        // always arrives.
        const crisisStream = createUIMessageStream({
          execute: ({ writer }) => {
            writer.write({ type: "start" });
            writer.write({ type: "data-crisis", data: { reason: risk.reason ?? "crisis" } });
            writer.write({ type: "finish" });
          },
        });
        return createUIMessageStreamResponse({ stream: crisisStream });
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

    // useChat speaks the UI message stream protocol. Returning plain text meant
    // the reply reached the browser but never rendered as a message.
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = "reply";
        // start/finish frame the assistant message. Without them useChat never
        // creates the message, so the text parts arrive with nowhere to render.
        writer.write({ type: "start" });
        writer.write({ type: "start-step" });
        writer.write({ type: "text-start", id });
        writer.write({ type: "text-delta", id, delta: reply });
        writer.write({ type: "text-end", id });
        writer.write({ type: "finish-step" });
        writer.write({ type: "finish" });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
