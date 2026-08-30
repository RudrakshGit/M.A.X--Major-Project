"use server";

import { db } from "@/db";
import { conversation, message, companion, memorySummary } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

function generateId() {
  return crypto.randomUUID();
}

export async function getUserConversations(userId: string) {
  const list = await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .orderBy(desc(conversation.updatedAt));

  return list;
}

export async function getOrCreateConversation(userId: string, conversationId?: string) {
  if (conversationId) {
    const [found] = await db
      .select()
      .from(conversation)
      .where(and(eq(conversation.id, conversationId), eq(conversation.userId, userId)))
      .limit(1);

    if (found) {
      return found;
    }
  }

  const existing = await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .orderBy(desc(conversation.updatedAt))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const companionSettings = await getCompanionSettings(userId);
  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: generateId(),
      userId,
      title: `Chat with ${companionSettings.name}`,
    })
    .returning();

  return newConversation;
}

export async function createNewConversation(userId: string, title?: string) {
  const companionSettings = await getCompanionSettings(userId);
  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: generateId(),
      userId,
      title: title || `Chat with ${companionSettings.name}`,
    })
    .returning();

  return newConversation;
}

export async function deleteConversation(conversationId: string, userId: string) {
  await db
    .delete(message)
    .where(eq(message.conversationId, conversationId));

  const [deleted] = await db
    .delete(conversation)
    .where(and(eq(conversation.id, conversationId), eq(conversation.userId, userId)))
    .returning();

  return deleted;
}

export async function renameConversation(conversationId: string, userId: string, newTitle: string) {
  const [updated] = await db
    .update(conversation)
    .set({
      title: newTitle.trim().slice(0, 80) || "Conversation",
      updatedAt: new Date(),
    })
    .where(and(eq(conversation.id, conversationId), eq(conversation.userId, userId)))
    .returning();

  return updated;
}

export async function touchConversation(conversationId: string, autoTitle?: string) {
  const updateData: { updatedAt: Date; title?: string } = {
    updatedAt: new Date(),
  };
  if (autoTitle) {
    updateData.title = autoTitle.trim().slice(0, 60);
  }
  await db
    .update(conversation)
    .set(updateData)
    .where(eq(conversation.id, conversationId));
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
