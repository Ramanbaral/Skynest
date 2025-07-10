"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { DownloadCloud, StarOff, Trash2 } from "lucide-react";
import { File } from "@/db/schema";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
function FavFiles() {
  const [allFavFiles, setAllFavFiles] = useState<File[] | null>(null);

  function convertBytesToMb(bytes: number) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  // Fetch favorite files from API
  const fetchFavFiles = async () => {
    try {
      const favRes = await axios.get("/api/fetch-fav");
      console.log(favRes.data);
      if (favRes.data.success) {
        toast.success("Fetched All FAV Files.", { position: "top-center" });
      }
      setAllFavFiles(favRes.data.favFiles);
    } catch (error) {
      console.error(error);
      toast.error("Something went Wrong!", { position: "top-center" });
    }
  };

  //fetch the files when user go to fav tab and also add a refresh btn
  useEffect(() => {
    fetchFavFiles();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favourite Files</CardTitle>
        <CardDescription>
          See all your favourite and important files in one place.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-6">
        <ScrollArea className="h-[60vh] w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent text-lg font-bold">
                <TableHead className="w-[300px] text-primary rounded-tl-xl">
                  File Name
                </TableHead>
                <TableHead className="text-primary">Type</TableHead>
                <TableHead className="text-primary">Size</TableHead>
                <TableHead className=" text-primary text-right rounded-tr-xl">
                  <span className="mr-30">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFavFiles?.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Image src="/pdf.png" width={64} height={64} alt="img" />
                      {item.name}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{convertBytesToMb(item.size)} MB</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <Button variant="outline" className="mx-2">
                          <DownloadCloud className="text-green-400" />
                          Download
                        </Button>
                        <Button variant="outline" className="mx-2">
                          <StarOff className="text-yellow-400" /> Unfav
                        </Button>
                        <Button variant="outline" className="mx-2">
                          <Trash2 className="text-destructive" /> Trash
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default FavFiles;
