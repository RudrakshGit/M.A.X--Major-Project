"use server";

import { db } from "@/db";
import { journeyEnrolment, journeyStep } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { journeys } from "@/content/journeys";

export async function enrollInJourney(journeyId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!journeys[journeyId]) {
    throw new Error("Invalid journey ID");
  }

  // Check if already enrolled
  const existing = await db.query.journeyEnrolment.findFirst({
    where: and(
      eq(journeyEnrolment.userId, session.user.id),
      eq(journeyEnrolment.journeyId, journeyId)
    ),
  });

  if (existing) {
    return existing; // Already enrolled
  }

  const [newEnrolment] = await db
    .insert(journeyEnrolment)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      journeyId,
      currentDay: 1,
    })
    .returning();

  revalidatePath("/journeys");
  revalidatePath(`/journeys/${journeyId}`);
  
  return newEnrolment;
}

export async function completeJourneyDay(enrolmentId: string, currentDay: number) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const enrolment = await db.query.journeyEnrolment.findFirst({
    where: eq(journeyEnrolment.id, enrolmentId),
  });

  if (!enrolment || enrolment.userId !== session.user.id) {
    throw new Error("Enrolment not found");
  }

  if (enrolment.currentDay !== currentDay) {
    throw new Error("Invalid day progression");
  }

  const journey = journeys[enrolment.journeyId];
  const isFinalDay = currentDay >= journey.days.length;

  // Insert step
  await db.insert(journeyStep).values({
    id: crypto.randomUUID(),
    enrolmentId,
    day: currentDay,
  });

  // Update enrolment
  await db
    .update(journeyEnrolment)
    .set({
      currentDay: isFinalDay ? currentDay : currentDay + 1,
      completedAt: isFinalDay ? new Date() : null,
    })
    .where(eq(journeyEnrolment.id, enrolmentId));

  revalidatePath("/journeys");
  revalidatePath(`/journeys/${enrolment.journeyId}`);
}

export async function getUserJourneys() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return [];
  }

  return await db.query.journeyEnrolment.findMany({
    where: eq(journeyEnrolment.userId, session.user.id),
  });
}
