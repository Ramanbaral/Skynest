"use client";
import { SigninForm } from "./_component/signin-form";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function SigninPage() {
  return (
    <>
      <div className="absolute flex justify-center gap-2 p-6 md:p-10 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          SkyNest
        </Link>
      </div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SigninForm />
        </div>
      </div>
    </>
  );
}
