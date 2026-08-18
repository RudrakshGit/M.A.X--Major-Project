"use server";

import { db } from "@/db";
import { screenerRun } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function submitScreenerRun(
  instrument: string,
  responses: number[],
  totalScore: number,
  band: string
) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [newRun] = await db
    .insert(screenerRun)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      instrument,
      responses,
      totalScore,
      band,
    })
    .returning();

  return newRun;
}
