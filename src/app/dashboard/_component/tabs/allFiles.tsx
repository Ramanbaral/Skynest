"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  // BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CircleX, FileIcon, LucideHome } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { File } from "@/db/schema";
import { useFilesAndFoldersStore } from "@/providers/filesAndFoldersStoreProvider";
import CreateFolder from "../createFolder";
import Loader from "../loader";

function AllFiles() {
  const router = useRouter();

  const [isFetchFileAndFoldersError, setIsFetchFileAndFoldersError] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    id: string | null;
  }>({ name: "Home", id: null });
  const [folderTraverseHistory, setFolderTraverseHistory] = useState<
    { name: string; id: string | null }[]
  >([]);
  const [selectedFileForAction, setSelectedFileForAction] = useState<{
    id: string;
    name: string;
    type: string;
  } | null>(null);
  const [currentHighlightedFile, setCurrentHighlightedFile] = useState<string | null>(
    null,
  );

  const { filesAndFolders, setFilesAndFolders } = useFilesAndFoldersStore(
    (state) => state,
  );

  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");

  const addFolderToHistory = (id: string, name: string) => {
    setFolderTraverseHistory((prevState) => {
      return [...prevState, currentLocation];
    });
    setCurrentLocation({ id, name });
    router.push(`/dashboard?parentId=${id}`);
    fetchFiles(id);
  };

  const goBack = () => {
    const lastFolder = folderTraverseHistory.at(-1) as {
      name: string;
      id: string | null;
    };
    setFolderTraverseHistory((prevState) => {
      return prevState.slice(0, -1);
    });
    setCurrentLocation(lastFolder);
    router.push(
      lastFolder.id === null ? "/dashboard" : `/dashboard?parentId=${lastFolder.id}`,
    );
    fetchFiles(lastFolder.id);
  };

  const gotoFolder = (id: string | null, folderName: string) => {
    if (id === null) gotoHome();
    else {
      setFolderTraverseHistory((prevState) => {
        const newFolderTraverseHistory: { name: string; id: string | null }[] = [];
        for (const folder of prevState) {
          if (folder.id !== id) newFolderTraverseHistory.push(folder);
          else break;
        }
        return newFolderTraverseHistory;
      });
      setCurrentLocation({ name: folderName, id: id });
      router.push(id === null ? "/dashboard" : `/dashboard?parentId=${id}`);
      fetchFiles(id);
    }
  };

  const gotoHome = () => {
    setFolderTraverseHistory([]);
    setCurrentLocation({ name: "Home", id: null });
    router.push("/dashboard");
    fetchFiles(null);
  };

  const addToFav = async (fileId: string) => {
    try {
      const res = await axios.patch(`/api/file/${fileId}/fav`);
      if (res.data.success) {
        toast.success("File Added To Fav!", { position: "top-center" });
      }
    } catch {
      toast.error("Something went wrong! Try later.", { position: "top-center" });
    }
  };

  const addToTrash = async (fileId: string) => {
    try {
      const res = await axios.patch(`/api/file/${fileId}/trash`);
      if (res.data.success) {
        //remove the file from state also
        toast.success("File moved to trash!", { position: "top-center" });
      }
    } catch {
      toast.error("Something went wrong! Try later.", { position: "top-center" });
    }
  };

  const fetchFiles = async (parentId: string | null) => {
    try {
      setFetchingFiles(true);
      const fetchFilesResponse: AxiosResponse<{
        success: boolean;
        message: string;
        files: File[];
      }> = await axios.get("/api/fetch-files", {
        params: {
          parentId,
        },
      });

      if (fetchFilesResponse.data.success) {
        setFilesAndFolders(fetchFilesResponse.data.files);
      }
    } catch (e) {
      console.log(e);
      setIsFetchFileAndFoldersError(true);
      toast.error("Problem Fetching Files!", { position: "top-center" });
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles(parentId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="outline"
                disabled={folderTraverseHistory.length === 0}
                onClick={() => {
                  goBack();
                }}
              >
                <ArrowLeft size={64} />{" "}
              </Button>
              <Button className="ml-4" onClick={gotoHome}>
                <LucideHome /> Home
              </Button>
            </div>

            <CreateFolder />
          </div>

          {folderTraverseHistory.length > 0 ? (
            <div className="mt-5">
              <Breadcrumb>
                <BreadcrumbList>
                  {folderTraverseHistory.map((folder, ind) => {
                    return (
                      <BreadcrumbItem key={ind}>
                        <BreadcrumbLink asChild>
                          <p
                            className="cursor-default"
                            data-id={folder.id}
                            data-name={folder.name}
                            onClick={(e) => {
                              const id =
                                e.currentTarget.dataset.id === undefined
                                  ? null
                                  : e.currentTarget.dataset.id;
                              const name = e.currentTarget.dataset.name as string;

                              gotoFolder(id, name);
                            }}
                          >
                            {folder.name}
                          </p>
                        </BreadcrumbLink>
                        {ind !== folderTraverseHistory.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </BreadcrumbItem>
                    );
                  })}

                  {/* <BreadcrumbItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                              <BreadcrumbEllipsis className="size-4" />
                              <span className="sr-only">Toggle menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem>Documentation</DropdownMenuItem>
                              <DropdownMenuItem>Themes</DropdownMenuItem>
                              <DropdownMenuItem>GitHub</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          ) : (
            ""
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-6">
        {fetchingFiles ? (
          <Loader />
        ) : isFetchFileAndFoldersError ? (
          <div className="flex flex-col gap-2 items-center justify-center">
            <CircleX size={64} className="text-destructive" />
            <p className="font-semibold">Problem Fetching Files</p>
            <p className="text-sm">please try later!</p>
          </div>
        ) : filesAndFolders.length === 0 ? (
          <div className="flex flex-col gap-2 items-center justify-center">
            <FileIcon size={64} className="text-primary" />
            <p className="font-semibold">No files available</p>
            <p className="text-sm">
              Upload your first file to get started with your personal cloud storage
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[50vh] w-fit">
            <div className="flex flex-wrap items-center gap-10">
              {filesAndFolders?.map((item, ind) => {
                let icon = "/file.png";
                if (item.type === "folder") {
                  icon = "/folder.png";
                } else if (item.type.startsWith("image")) {
                  icon = "/picture.png";
                } else if (item.type.endsWith("pdf")) {
                  icon = "/pdf.png";
                }

                return (
                  <div
                    key={ind}
                    className={`flex flex-col gap-3 items-center p-2 cursor-pointer rounded-md ${currentHighlightedFile === item.id ? "bg-accent" : ""} `}
                    data-id={item.id} // store the unique id of file
                    data-filetype={item.type}
                    data-name={item.name}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setCurrentHighlightedFile(e.currentTarget.dataset.id as string);
                      setSelectedFileForAction({
                        id: e.currentTarget.dataset.id as string,
                        type: e.currentTarget.dataset.filetype as string,
                        name: e.currentTarget.dataset.name as string,
                      });
                      setIsMenuOpen(!isMenuOpen);
                      setMenuPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onDoubleClick={(e) => {
                      if (e.currentTarget.dataset.filetype === "folder") {
                        addFolderToHistory(item.id, item.name);
                      }
                    }}
                    onClick={(e) => {
                      setCurrentHighlightedFile(e.currentTarget.dataset.id as string);
                    }}
                  >
                    {item.thumbnailUrl ? (
                      <Image src={item.thumbnailUrl} width={64} height={64} alt="icon" />
                    ) : (
                      <Image src={icon} width={64} height={64} alt="icon" />
                    )}
                    <ScrollArea className="max-w-35 h-10">
                      <p>{item.name}</p>
                    </ScrollArea>
                  </div>
                );
              })}
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuContent
                  className="w-56 absolute"
                  align="start"
                  style={{
                    top: menuPosition.y,
                    left: menuPosition.x,
                  }}
                >
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        if (selectedFileForAction?.type === "folder") {
                          addFolderToHistory(
                            selectedFileForAction.id,
                            selectedFileForAction.name,
                          );
                        }
                      }}
                    >
                      Open
                    </DropdownMenuItem>
                    {selectedFileForAction?.type !== "folder" && (
                      <DropdownMenuItem
                        onClick={() => {
                          addToFav(selectedFileForAction?.id as string);
                        }}
                      >
                        Add to Fav
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        addToTrash(selectedFileForAction?.id as string);
                      }}
                    >
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default AllFiles;
