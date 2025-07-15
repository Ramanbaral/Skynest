import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { filesTable } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json(
        {
          success: false,
          message: "File id is required.",
        },
        { status: 400 },
      );
    }
    const { newName } = await req.json();

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

    //select the file with given id and check if the file belong to the user
    const [file] = await db
      .select()
      .from(filesTable)
      .where(and(eq(filesTable.id, fileId), eq(filesTable.userId, userId)));
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File doesn't exists.",
        },
        { status: 404 },
      );
    }

    await db.update(filesTable).set({ name: newName }).where(eq(filesTable.id, fileId));

    return NextResponse.json(
      {
        success: "true",
        message: "File Renamed.",
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while staring a file.",
      },
      { status: 500 },
    );
  }
}
