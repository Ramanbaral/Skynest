import { db } from "@/db";
import { filesTable, InsertFile } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 }
      );
    }

    const { imagekit, userId: userIdFromReq } = await request.json();

    if (userId !== userIdFromReq) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 }
      );
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid File upload",
        },
        { status: 400 }
      );
    }

    const fileData: InsertFile = {
      userId: userIdFromReq,
      name: imagekit.name || "untitled",
      path: imagekit.filePath || `/skynest/${userIdFromReq}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(filesTable).values(fileData).returning();

    return NextResponse.json({
      success: true,
      message: "New file inserted successfully.",
      file: newFile,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}
