"use client";
import { SigninForm } from "./_component/signin-form";
import Image from "next/image";
import Link from "next/link";

export default function SigninPage() {
  return (
    <>
      <div className="absolute flex justify-center gap-2 p-6 md:p-10 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
          <span className="font-semibold text-primary">SkyNest</span>
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
