"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteAccount() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Delete from DB. Cascade delete is configured for all related tables.
  await db.delete(user).where(eq(user.id, session.user.id));

  // The user is deleted, their session is invalid.
  // Better Auth also provides an API for this, but deleting from db directly handles cascade on our custom tables safely.
  
  redirect("/");
}
