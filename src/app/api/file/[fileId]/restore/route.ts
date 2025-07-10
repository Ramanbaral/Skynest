import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { filesTable } from "@/db/schema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { fileId: string } },
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
          message: "File doesn't exits",
        },
        { status: 400 },
      );
    }

    //set trash status to false
    const trashValue = false;
    await db
      .update(filesTable)
      .set({ isTrash: trashValue })
      .where(eq(filesTable.id, fileId));

    return NextResponse.json(
      {
        success: true,
        message: "File removed from Trash.",
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while removing file from trash.",
      },
      { status: 500 },
    );
  }
}
