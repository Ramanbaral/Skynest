import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    const allFavFiles = await db
      .select()
      .from(filesTable)
      .where(
        and(
          eq(filesTable.userId, userId),
          eq(filesTable.isStarred, true),
          eq(filesTable.isTrash, false),
        ),
      )
      .orderBy(desc(filesTable.updatedAt));

    return NextResponse.json(
      {
        success: true,
        message: "Fetched all fav files.",
        favFiles: allFavFiles,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching fav files.",
      },
      { status: 500 },
    );
  }
}
