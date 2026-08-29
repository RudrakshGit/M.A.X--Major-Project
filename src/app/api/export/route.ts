import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  journalEntry,
  screenerRun,
  moodCheckIn,
  conversation,
  message,
  companion,
  memorySummary,
  journeyEnrolment,
  consent,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * docs/data-model.md promises the student everything we hold about them.
 * Conversations are the most personal thing in this app, so an export without
 * them is not the promise being kept. safetyEvent is deliberately excluded — it
 * carries reason codes and no content, and is not about the student.
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userId = session.user.id;

    const conversations = await db.query.conversation.findMany({
      where: eq(conversation.userId, userId),
    });
    const conversationIds = conversations.map((c) => c.id);

    const [journals, screeners, moods, messages, companions, memories, journeys, consents] =
      await Promise.all([
        db.query.journalEntry.findMany({ where: eq(journalEntry.userId, userId) }),
        db.query.screenerRun.findMany({ where: eq(screenerRun.userId, userId) }),
        db.query.moodCheckIn.findMany({ where: eq(moodCheckIn.userId, userId) }),
        conversationIds.length
          ? db.query.message.findMany({ where: inArray(message.conversationId, conversationIds) })
          : Promise.resolve([]),
        db.query.companion.findMany({ where: eq(companion.userId, userId) }),
        db.query.memorySummary.findMany({ where: eq(memorySummary.userId, userId) }),
        db.query.journeyEnrolment.findMany({ where: eq(journeyEnrolment.userId, userId) }),
        db.query.consent.findMany({ where: eq(consent.userId, userId) }),
      ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      account: {
        username: session.user.name,
        locale: session.user.locale,
        createdAt: session.user.createdAt,
      },
      data: {
        conversations,
        messages,
        companion: companions,
        memorySummaries: memories,
        journals,
        screeners,
        moods,
        journeys,
        consents,
      },
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="max-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
