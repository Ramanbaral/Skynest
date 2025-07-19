import Image from "next/image";

import Explorer from "./_component/explorer";
import UserProfile from "./_component/userprofile";
import UploadButton from "./_component/uploadBtn";
import StorageInfo from "./_component/StorageInfo";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Dashboard() {
  return (
    <div>
      <div className="w-screen flex justify-between items-center px-20 py-5 border border-accent">
        <div className="hidden md:flex gap-5 items-center cursor-pointer">
          <Image src={"/logo.png"} width={50} height={50} alt="logo" />
          <span className="text-primary text-2xl font-bold">SkyNest</span>
        </div>

        <div>
          <Suspense>
            <UploadButton />
          </Suspense>
        </div>

        <div className="flex items-center gap-5">
          <UserProfile />
          <ThemeToggle />
        </div>
      </div>

      <Explorer />

      <StorageInfo />
    </div>
  );
}
