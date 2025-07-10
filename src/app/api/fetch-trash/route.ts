import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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

    const allTrashFiles = await db
      .select()
      .from(filesTable)
      .where(and(eq(filesTable.userId, userId), eq(filesTable.isTrash, true)));

    return NextResponse.json(
      {
        success: true,
        message: "Fetched all trash files.",
        trashFiles: allTrashFiles,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching trash files.",
      },
      { status: 500 },
    );
  }
}
