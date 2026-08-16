import { db } from "@/db";
import { message, memorySummary } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateText } from "ai";
import { model } from "./provider";

export async function generateMemorySummary(userId: string, conversationId: string) {
  try {
    // 1. Fetch recent messages
    const recentMessages = await db
      .select()
      .from(message)
      .where(eq(message.conversationId, conversationId))
      .orderBy(desc(message.createdAt))
      .limit(30);
      
    if (recentMessages.length < 15) {
      // Don't summarize if there aren't many messages
      return;
    }

    // Sort back to chronological
    recentMessages.reverse();

    // 2. Fetch existing summary
    const existingSummaryResult = await db
      .select()
      .from(memorySummary)
      .where(eq(memorySummary.userId, userId))
      .limit(1);
      
    const currentSummary = existingSummaryResult.length > 0 ? existingSummaryResult[0].summary : "No previous summary.";

    // 3. Prompt for summarization
    const prompt = `
You are a memory module for a mental health companion.
Below is the current memory summary of the user, followed by the latest conversation.
Update the summary to include any new key information (e.g., stressors, named individuals, ongoing situations).
Keep it concise, factual, and written in the third person. Focus on context that would help a companion be empathetic and contextual in the future.

CURRENT SUMMARY:
${currentSummary}

LATEST CONVERSATION:
${recentMessages.map(m => `${m.role}: ${m.content}`).join("\n")}

NEW SUMMARY:
`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const newSummaryText = text.trim();

    // 4. Upsert summary
    if (existingSummaryResult.length > 0) {
      await db
        .update(memorySummary)
        .set({ summary: newSummaryText, updatedAt: new Date() })
        .where(eq(memorySummary.id, existingSummaryResult[0].id));
    } else {
      await db
        .insert(memorySummary)
        .values({
          id: crypto.randomUUID(),
          userId,
          summary: newSummaryText,
        });
    }

    return newSummaryText;
  } catch (error) {
    console.error("Failed to generate memory summary:", error);
  }
}
