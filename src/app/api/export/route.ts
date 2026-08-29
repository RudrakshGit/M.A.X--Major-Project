import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { journalEntry, screenerRun, moodCheckIn } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const [journals, screeners, moods] = await Promise.all([
      db.query.journalEntry.findMany({
        where: eq(journalEntry.userId, userId),
        orderBy: (journalEntry, { desc }) => [desc(journalEntry.createdAt)],
      }),
      db.query.screenerRun.findMany({
        where: eq(screenerRun.userId, userId),
        orderBy: (screenerRun, { desc }) => [desc(screenerRun.createdAt)],
      }),
      db.query.moodCheckIn.findMany({
        where: eq(moodCheckIn.userId, userId),
        orderBy: (moodCheckIn, { desc }) => [desc(moodCheckIn.createdAt)],
      }),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        name: session.user.name,
        email: session.user.email,
      },
      data: {
        journals,
        screeners,
        moods,
      }
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="max-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
