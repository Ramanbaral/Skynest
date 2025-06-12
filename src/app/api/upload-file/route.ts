import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { db } from "@/db";
import { filesTable, InsertFile } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {v4 as uuidv4} from "uuid"

const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch("/api/upload-auth");
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

export async function POST(req: NextRequest) {
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
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided.",
        },
        { status: 400 }
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
            eq(filesTable.isFolder, true)
          )
        );

      if (!parentFolder) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid parentId.",
          },
          { status: 400 }
        );
      }
    }

    if (
      !(
        file.type.startsWith("image") && file.type.startsWith("application/pdf")
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only images and pdf are supported.",
        },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/skynest/${userId}/folder/${parentId}`
      : `/skynest/${userId}`;

    const fileExtension = file.name.split(".")[-1];
    console.log("File Extension - ", fileExtension);
    //only allow the allow file extension ["jpg", "jpeg", "png", "pdf", "mp3", "mp4", "txt", "md"]
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const abortController = new AbortController();

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    const uploadResponse = await upload({
      // Authentication parameters
      expire,
      token,
      signature,
      publicKey,
      file: fileBuffer,
      fileName: uniqueFilename,
      folder: folderPath,
      useUniqueFileName: false,
      // Progress callback to update upload progress state
      // onProgress: (event) => {
      //     setProgress((event.loaded / event.total) * 100);
      // },
      // Abort signal to allow cancellation of the upload if needed.
      abortSignal: abortController.signal,
    });
    console.log("Upload response:", uploadResponse);

    const fileData: InsertFile = {
      name: file.name,
      path: uploadResponse.filePath as string,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url as string,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
    };

    const newFile = await db.insert(filesTable).values(fileData).returning();

    return NextResponse.json(
      {
        success: true,
        message: "file uploaded successfully.",
        newFile,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle specific error types provided by the ImageKit SDK.
    if (error instanceof ImageKitAbortError) {
      console.error("Upload aborted:", error.reason);
    } else if (error instanceof ImageKitInvalidRequestError) {
      console.error("Invalid request:", error.message);
    } else if (error instanceof ImageKitUploadNetworkError) {
      console.error("Network error:", error.message);
    } else if (error instanceof ImageKitServerError) {
      console.error("Server error:", error.message);
    } else {
      // Handle any other errors that may occur.
      console.error("Upload error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Problem uploading file.",
      },
      { status: 500 }
    );
  }
}
