import { db } from "@/db";
import { filesTable, File } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const parentId = searchParams.get("parentId");

    let allUserFiles: File[];
    if (parentId === null) {
      allUserFiles = await db
        .select()
        .from(filesTable)
        .where(and(isNull(filesTable.parentId), eq(filesTable.userId, userId)));
    } else {
      allUserFiles = await db
        .select()
        .from(filesTable)
        .where(
          and(eq(filesTable.parentId, parentId), eq(filesTable.userId, userId))
        );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fetched all files of folder.",
        files: allUserFiles,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching files",
      },
      { status: 500 }
    );
  }
}
