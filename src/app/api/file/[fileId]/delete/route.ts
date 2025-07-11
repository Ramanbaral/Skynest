import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import axios from "axios";

let globalUserId: string;
const imageKitAuth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString(
  "base64",
);

async function deleteFolder(folderId: string) {
  //Get all the children folders inside the given folder
  const childrenIds = await db
    .select({ id: filesTable.id, isFolder: filesTable.isFolder })
    .from(filesTable)
    .where(eq(filesTable.parentId, folderId));

  const childrenFolderIds = childrenIds.filter((item) => item.isFolder === true);
  const childrenFileIds = childrenIds.filter((item) => item.isFolder === false);

  for (const folder of childrenFolderIds) {
    deleteFolder(folder.id);
  }

  //Folder may not exits on imagekit because it is empty folder can cause 404
  if (childrenFileIds.length > 0) {
    //Delete the folder from imageKit
    const folderPath = `/skynest/${globalUserId}/folder/${folderId}`;
    await axios.delete("https://api.imagekit.io/v1/folder", {
      data: {
        folderPath: folderPath,
      },
      headers: {
        Authorization: `Basic ${imageKitAuth}`,
      },
    });
  }

  //Delete the folder and files inside the folder from DB
  await db.delete(filesTable).where(eq(filesTable.id, folderId));
  await db
    .delete(filesTable)
    .where(and(eq(filesTable.parentId, folderId), eq(filesTable.isFolder, false)));
}

async function deleteFileFromDB(imageKitFileId: string, fileId: string) {
  //Delete File from imageKit
  await axios.delete(`https://api.imagekit.io/v1/files/${imageKitFileId}`, {
    headers: {
      Authorization: `Basic ${imageKitAuth}`,
    },
  });

  //Delete File from database
  await db.delete(filesTable).where(eq(filesTable.id, fileId));
}

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
    globalUserId = userId;

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

    if (file.type === "folder") {
      await deleteFolder(file.id);

      return NextResponse.json({
        success: true,
        message: "Folder Deleted.",
      });
    } else {
      if (file.fileId) await deleteFileFromDB(file.fileId, file.id);
      return NextResponse.json({
        success: true,
        message: "File Deleted.",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting a files.",
      },
      { status: 500 },
    );
  }
}
