import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpFromLine, Trash2, X } from "lucide-react";
import { File } from "@/db/schema";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import convertBytesToMb from "@/helpers/convertBytesToMb";
import parseFileType from "@/helpers/parseFileType";
import Loader from "../loader";

function Trash() {
  const [trashFiles, setTrashFiles] = useState<File[]>([]);
  const [isFetchingFiles, setIsFetchingFile] = useState(false);

  const fetchTrashFiles = async () => {
    try {
      setIsFetchingFile(true);
      const fetchTrashRes = await axios.get("/api/fetch-trash");
      if (fetchTrashRes.data.success) {
        setTrashFiles(fetchTrashRes.data.trashFiles);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something Went Wrong! Please Try later.", { position: "top-center" });
    } finally {
      setIsFetchingFile(false);
    }
  };

  useEffect(() => {
    if (trashFiles.length === 0) fetchTrashFiles();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Trash</CardTitle>
          <div>
            <Button variant="destructive">
              <Trash2 /> Empty Trash
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      {isFetchingFiles ? (
        <Loader />
      ) : (
        <CardContent className="grid gap-6">
          <ScrollArea className="h-[58vh] w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent text-lg font-bold">
                  <TableHead className="w-[300px] text-primary rounded-tl-xl">
                    File Name
                  </TableHead>
                  <TableHead className="text-primary">Type</TableHead>
                  <TableHead className="text-primary">Size</TableHead>
                  <TableHead className=" text-primary text-right rounded-tr-xl">
                    <span className="mr-20">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashFiles?.map((file) => {
                  const fileType = parseFileType(file.type);

                  return (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium flex items-center gap-2 mr-10">
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
                        {fileType === "Folder" && (
                          <Image src="/folder.png" width={64} height={64} alt="img" />
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
                            <ArrowUpFromLine className="text-green-400" />
                            Restore
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="mx-2">
                                <X className="text-destructive" /> Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete your files from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="cursor-pointer bg-destructive hover:bg-destructive">
                                  Yes, Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}

export default Trash;
