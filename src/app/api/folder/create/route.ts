import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { filesTable, InsertFile } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 },
      );
    }

    const { name, userId: userIdFromReq, parentId = null } = await request.json();

    if (userId !== userIdFromReq) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 },
      );
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Folder name is required.",
        },
        { status: 400 },
      );
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(filesTable)
        .where(
          and(
            eq(filesTable.id, parentId),
            eq(filesTable.userId, userIdFromReq),
            eq(filesTable.isFolder, true),
          ),
        );

      if (!parentFolder) {
        return NextResponse.json(
          {
            success: false,
            message: "Parent folder not valid.",
          },
          { status: 400 },
        );
      }
    }

    const folder: InsertFile = {
      name: name.trim(),
      userId: userIdFromReq,
      path: `/folders/${userId}/${uuidv4()}`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      isFolder: true,
      parentId: parentId,
    };

    const [newFolder] = await db.insert(filesTable).values(folder).returning();

    return NextResponse.json(
      {
        success: "true",
        message: "New Folder Created.",
        folder: newFolder,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: "false",
        message: "Problem creating new folder.",
      },
      { status: 500 },
    );
  }
}
