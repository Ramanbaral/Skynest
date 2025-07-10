import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { filesTable, InsertFile } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = formData.get("parentId") as string;

    if (userId !== formUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided.",
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
            eq(filesTable.userId, userId),
            eq(filesTable.isFolder, true),
          ),
        );

      if (!parentFolder) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid parentId.",
          },
          { status: 400 },
        );
      }
    }

    if (!(file.type.startsWith("image") || file.type.startsWith("application/pdf"))) {
      return NextResponse.json(
        {
          success: false,
          message: "Only images and pdf are supported.",
        },
        { status: 400 },
      );
    }

    //check for file size should be less than 5 MB;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File too large.",
        },
        { status: 400 },
      );
    }

    // const buffer = await file.arrayBuffer();
    // const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/skynest/${userId}/folder/${parentId}`
      : `/skynest/${userId}`;

    const fileExtension = file.name.split(".").pop();
    //only allow the allow file extension ["jpg", "jpeg", "png", "pdf", "txt", "md"]
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    //upload the file to imagekit using their api
    // -------------------------------------------

    const data = new FormData();
    data.set("file", file);
    data.set("fileName", uniqueFilename);
    data.set("folder", folderPath);

    const imageKitAuth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString(
      "base64",
    );

    const uploadResponse = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      data,
      {
        headers: {
          Authorization: `Basic ${imageKitAuth}`,
        },
      },
    );

    const fileData: InsertFile = {
      name: file.name,
      path: uploadResponse.data.filePath as string,
      size: file.size,
      type: file.type,
      fileId: uploadResponse.data.fileId,
      parentId: parentId,
      fileUrl: uploadResponse.data.url as string,
      thumbnailUrl: uploadResponse.data.thumbnailUrl || null,
      userId: userId,
    };

    const newFile = await db.insert(filesTable).values(fileData).returning();

    return NextResponse.json(
      {
        success: true,
        message: "file uploaded successfully.",
        newFile: newFile[0],
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Problem uploading file.",
      },
      { status: 500 },
    );
  }
}
