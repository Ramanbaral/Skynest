import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { filesTable, InsertFile, UserStorageInfo } from "@/db/schema";
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

    //check if the user has storage to store the current file
    const userStorageInfo = await db
      .select()
      .from(UserStorageInfo)
      .where(eq(UserStorageInfo.userId, userId));

    let storageUsedByUserInBytes = 0;
    let storageCapacityOfUserInBytes = 1;
    if (userStorageInfo.length === 0) {
      await db.insert(UserStorageInfo).values({ userId: userId });
    } else {
      storageUsedByUserInBytes = userStorageInfo[0].storageUsed as number;
      storageCapacityOfUserInBytes = userStorageInfo[0].storageCapacity as number;
      if (
        (storageUsedByUserInBytes ?? 0) + file.size >
        (storageCapacityOfUserInBytes ?? 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Your storage capacity is full.",
          },
          { status: 400 },
        );
      }
    }

    //check for file size should be less than 5 MB;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File too large. Limit: 5 MB",
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

    //upload the file to imagekit
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

    //update user storage info
    await db
      .update(UserStorageInfo)
      .set({
        storageUsed: (storageUsedByUserInBytes ?? 0) + file.size,
        storageUsedPercentage: Math.floor(
          ((storageUsedByUserInBytes + file.size) / storageCapacityOfUserInBytes) * 100,
        ),
      })
      .where(eq(UserStorageInfo.userId, userId));

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully.",
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
