"use client";

import { SignupForm } from "./_component/sign-up-form";
import { InputOTPForm } from "./_component/otp-form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [verifying, setVerifying] = useState(false);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start text-primary">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image src="/logo.png" width={32} height={32} alt="logo" />
            <span className="font-semibold">SkyNest</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {verifying ? <InputOTPForm /> : <SignupForm setVerifying={setVerifying} />}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* <Image
          src="https://unsplash.com/photos/worms-eye-view-photography-of-ceiling-LqKhnDzSF-8"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
