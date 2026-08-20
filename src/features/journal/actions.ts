"use server";

import { db } from "@/db";
import { journalEntry } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveJournalEntry(mood: string, content?: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [newEntry] = await db
    .insert(journalEntry)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      mood,
      content,
    })
    .returning();

  revalidatePath("/journal");
  return newEntry;
}

export async function getJournalHistory() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const entries = await db
    .select()
    .from(journalEntry)
    .where(eq(journalEntry.userId, session.user.id))
    .orderBy(desc(journalEntry.createdAt));

  return entries;
}
