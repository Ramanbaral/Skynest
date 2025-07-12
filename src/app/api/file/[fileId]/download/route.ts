import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
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
        { status: 404 },
      );
    }

    const fileUrl = file.fileUrl;
    const fileName = file.name;

    // Fetch the file from ImageKit using the public URL.
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return new Response("Failed to fetch file", { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error downloading file", { status: 500 });
  }
}
