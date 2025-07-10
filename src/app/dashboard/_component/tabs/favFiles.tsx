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
import { DownloadCloud, StarOff, Trash2, FileIcon } from "lucide-react";
import Loader from "../loader";
import { File } from "@/db/schema";
import convertBytesToMb from "@/helpers/convertBytesToMb";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import parseFileType from "@/helpers/parseFileType";

function FavFiles() {
  const [favFiles, setFavFiles] = useState<File[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const addToTrash = async (fileId: string) => {
    try {
      const res = await axios.patch(`/api/file/${fileId}/trash`);
      if (res.data.success) {
        toast.success("File moved to trash!", { position: "top-center" });
        setFavFiles((prevState) => {
          const newState = prevState.filter((file) => file.id !== fileId);
          return newState;
        });
      }
    } catch {
      toast.error("Something went wrong! Try later.", { position: "top-center" });
    }
  };

  const removeFromFav = async (fileId: string) => {
    try {
      const res = await axios.patch(`/api/file/${fileId}/unfav`);
      if (res.data.success) {
        setFavFiles((prevState) => {
          const newState = prevState.filter((file) => file.id !== fileId);
          return newState;
        });
      }
    } catch {
      toast.error("Something went wrong! Try later.", { position: "top-center" });
    }
  };

  const fetchFavFiles = async () => {
    try {
      setFetchingFiles(true);
      const favRes = await axios.get("/api/fetch-fav");
      if (favRes.data.success) {
        setFavFiles(favRes.data.favFiles);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went Wrong!", { position: "top-center" });
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    if (favFiles.length === 0) fetchFavFiles();
  }, []);

  return (
    <Card>
      {fetchingFiles === true ? (
        <Loader />
      ) : favFiles.length === 0 ? (
        <div className="flex flex-col gap-2 items-center justify-center">
          <FileIcon size={64} className="text-primary" />
          <p className="font-semibold">No Favourites Files</p>
          <p className="text-sm">
            Right click on your favourite file and select Add to fav
          </p>
        </div>
      ) : (
        <>
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
                  {favFiles.map((file) => {
                    const fileType = parseFileType(file.type);
                    return (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center gap-5 mr-5">
                          {fileType === "Image" && (
                            <Image
                              src={file.thumbnailUrl || "/picture.png"}
                              width={64}
                              height={64}
                              alt="img"
                            />
                          )}
                          {fileType === "PDF" && (
                            <Image src="/pdf.png" width={64} height={64} alt="img" />
                          )}
                          {fileType === "Unknown" && (
                            <Image src="/file.png" width={64} height={64} alt="img" />
                          )}
                          <span className="max-w-md overflow-hidden">{file.name}</span>
                        </TableCell>
                        <TableCell>{fileType}</TableCell>
                        <TableCell>{convertBytesToMb(file.size)} MB</TableCell>
                        <TableCell className="text-right">
                          <div>
                            <Button variant="outline" className="mx-2">
                              <DownloadCloud className="text-green-400" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              className="mx-2"
                              onClick={() => {
                                removeFromFav(file.id);
                              }}
                            >
                              <StarOff className="text-yellow-400" /> Unfav
                            </Button>
                            <Button
                              variant="outline"
                              className="mx-2"
                              onClick={() => {
                                addToTrash(file.id);
                              }}
                            >
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
        </>
      )}
    </Card>
  );
}

export default FavFiles;
