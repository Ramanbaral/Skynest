import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import axios from "axios";

export async function DELETE(
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

    //Delete File from imageKit
    const imageKitFileId = file.fileId;
    const imageKitAuth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString(
      "base64",
    );
    const deleteFileResponse = await axios.delete(
      `https://api.imagekit.io/v1/files/${imageKitFileId}`,
      {
        headers: {
          Authorization: `Basic ${imageKitAuth}`,
        },
      },
    );

    //Delete File from database
    const [deletedFile] = await db
      .delete(filesTable)
      .where(and(eq(filesTable.id, fileId), eq(filesTable.userId, userId)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "File Deleted.",
      deletedFile,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting a file.",
      },
      { status: 500 },
    );
  }
}
