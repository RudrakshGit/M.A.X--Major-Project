"use server";

import { db } from "@/db";
import { user, screenerRun, moodCheckIn } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validatePrivacyCohort } from "./validators";

export async function getCampusAggregates(institutionId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin" || session.user.institutionId !== institutionId) {
    throw new Error("Unauthorized");
  }

  // Count active students in this institution
  const activeStudentsResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(eq(user.institutionId, institutionId));

  const totalStudents = activeStudentsResult[0]?.count || 0;

  validatePrivacyCohort(totalStudents);

  // Get all user IDs for this institution
  const institutionUsers = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.institutionId, institutionId));
  
  const userIds = institutionUsers.map(u => u.id);

  if (userIds.length === 0) {
    throw new Error("INSUFFICIENT_DATA");
  }

  // Aggregate PHQ-9 runs
  const phq9Runs = await db
    .select({
      band: screenerRun.band,
      count: sql<number>`count(*)::int`,
    })
    .from(screenerRun)
    .where(
      sql`${screenerRun.userId} IN (${sql.join(userIds, sql`, `)}) AND ${screenerRun.instrument} = 'phq9'`
    )
    .groupBy(screenerRun.band);

  // Aggregate mood check-ins (average score)
  const moodResult = await db
    .select({
      averageScore: sql<number>`avg(${moodCheckIn.score})::float`,
      totalCheckIns: sql<number>`count(*)::int`,
    })
    .from(moodCheckIn)
    .where(sql`${moodCheckIn.userId} IN (${sql.join(userIds, sql`, `)})`);

  return {
    totalStudents,
    phq9Distribution: phq9Runs,
    moodStats: moodResult[0] || { averageScore: null, totalCheckIns: 0 },
  };
}
