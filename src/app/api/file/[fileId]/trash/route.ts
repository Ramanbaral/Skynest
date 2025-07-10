import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { filesTable } from "@/db/schema";

export async function PATCH() {}
