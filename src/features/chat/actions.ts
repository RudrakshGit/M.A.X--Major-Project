"use server";

import { db } from "@/db";
import { conversation, message, companion, memorySummary } from "@/db/schema";
import { eq } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

export async function getOrCreateConversation(userId: string) {
  const existing = await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: generateId(),
      userId,
      title: "Chat with M.A.X",
    })
    .returning();

  return newConversation;
}

export async function loadChatHistory(conversationId: string) {
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(message.createdAt);

  return messages;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string,
  riskLevel: "none" | "distress" | "crisis" = "none"
) {
  const [newMessage] = await db
    .insert(message)
    .values({
      id: generateId(),
      conversationId,
      role,
      content,
      riskLevel,
    })
    .returning();

  return newMessage;
}

export async function getCompanionSettings(userId: string) {
  const existing = await db
    .select()
    .from(companion)
    .where(eq(companion.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create default if none exists
  const [newCompanion] = await db
    .insert(companion)
    .values({
      id: generateId(),
      userId,
      name: "M.A.X",
      tone: "warm",
    })
    .returning();

  return newCompanion;
}

export async function updateCompanionSettings(userId: string, name: string, tone: string) {
  const existing = await getCompanionSettings(userId);
  
  const [updated] = await db
    .update(companion)
    .set({
      name,
      tone,
      updatedAt: new Date(),
    })
    .where(eq(companion.id, existing.id))
    .returning();

  return updated;
}

export async function getMemorySummary(userId: string) {
  const existing = await db
    .select()
    .from(memorySummary)
    .where(eq(memorySummary.userId, userId))
    .limit(1);

  return existing.length > 0 ? existing[0] : null;
}
