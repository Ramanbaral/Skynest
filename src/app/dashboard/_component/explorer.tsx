"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import FavFiles from "./tabs/favFiles";
import AllFiles from "./tabs/allFiles";
import Trash from "./tabs/trash";

export default function Explorer() {
  return (
    <div className="flex flex-col gap-6 mx-10 mt-5">
      <Tabs defaultValue="allfiles">
        <div className="grid place-content-center">
          <TabsList>
            <TabsTrigger value="allfiles">
              <Image src={"/allfiles.png"} height={30} width={30} alt="IC" />{" "}
              <span className="text-[1rem]">All Files</span>
            </TabsTrigger>
            <TabsTrigger value="favourite">
              <Image src={"/star.png"} height={30} width={30} alt="IC" />
              <span className="text-[1rem]">Fav</span>
            </TabsTrigger>
            <TabsTrigger value="trash">
              <Image src={"/trash.png"} height={30} width={30} alt="IC" />
              <span className="text-[1rem]">Trash</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="allfiles">
          <AllFiles />
        </TabsContent>
        <TabsContent value="favourite">
          <FavFiles />
        </TabsContent>
        <TabsContent value="trash">
          <Trash />
        </TabsContent>
      </Tabs>
    </div>
  );
}
