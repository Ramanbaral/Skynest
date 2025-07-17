import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { UserStorageInfo } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const userStorageInfo = await db
      .select()
      .from(UserStorageInfo)
      .where(eq(UserStorageInfo.userId, userId));

    if (userStorageInfo.length === 0) {
      const [insertedStorageInfo] = await db
        .insert(UserStorageInfo)
        .values({ userId: userId })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "user storage info fetched.",
          storageInfo: insertedStorageInfo,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "user storage info fetched.",
          storageInfo: userStorageInfo[0],
        },
        { status: 200 },
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! please try later.",
      },
      { status: 500 },
    );
  }
}
