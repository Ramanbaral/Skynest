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
import { useState, useEffect, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { File } from "@/db/schema";
import { useFilesAndFoldersStore } from "@/providers/filesAndFoldersStoreProvider";
import { useUploadBtnRefStore } from "@/stores/uploadBtnRefStore";
import CreateFolder from "../createFolder";
import Loader from "../loader";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ImagePreview } from "../imagePreview";
import parseFileType from "@/helpers/parseFileType";
import { PdfPreviewModal } from "../pdfPreview";

function AllFiles() {
  const router = useRouter();

  const [isFetchFileAndFoldersError, setIsFetchFileAndFoldersError] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");
  const [currentPdfPreviewUrl, setCurrentPdfPreviewUrl] = useState("");
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
  const [fileToRenameId, setFileToRenameId] = useState<string | null>(null);

  const { filesAndFolders, setFilesAndFolders } = useFilesAndFoldersStore(
    (state) => state,
  );

  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");

  const { register, handleSubmit, reset } = useForm();

  const renameFile = async (fileId: string, newName: string) => {
    const newNameTrimmed = newName.trim();
    setFileToRenameId(null);
    let oldFileName: string;
    const newFilesAndFolders = filesAndFolders.map((file) => {
      if (file.id === fileId) {
        oldFileName = file.name;
        file.name = newNameTrimmed;
      }
      return file;
    });
    setFilesAndFolders(newFilesAndFolders);
    try {
      if (newName.length === 0) throw new Error();
      await axios.patch(`/api/file/${fileId}/rename`, {
        newName: newNameTrimmed,
      });
    } catch {
      toast.error("Something Went Wrong.", { position: "top-center" });
      const newFilesAndFolders = filesAndFolders.map((file) => {
        if (file.id === fileId) {
          file.name = oldFileName;
        }
        return file;
      });
      setFilesAndFolders(newFilesAndFolders);
    } finally {
      reset();
    }
  };

  const renameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    renameInputRef.current?.focus();
  }, [fileToRenameId]);

  const uploadBtnRef = useUploadBtnRefStore((state) => state.btnRef);

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
        toast.success("Moved to trash!", { position: "top-center" });

        const newFileAndFolders = filesAndFolders.filter((item) => item.id !== fileId);
        setFilesAndFolders(newFileAndFolders);
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
              <span
                className="text-blue-500 font-bold underline cursor-pointer"
                onClick={() => {
                  uploadBtnRef?.current?.click();
                }}
              >
                Upload
              </span>{" "}
              your first file to get started with your personal cloud storage
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[50vh] w-fit">
            <div className="flex flex-wrap items-center gap-10">
              {filesAndFolders?.map((item, ind) => {
                let icon = "/file.png";
                const fileType = parseFileType(item.type);

                if (fileType === "Folder") {
                  icon = "/folder.png";
                } else if (fileType === "Image") {
                  icon = "/picture.png";
                } else if (fileType === "PDF") {
                  icon = "/pdf.png";
                }

                return (
                  <div
                    key={ind}
                    className={`flex flex-col gap-3 items-center p-2 cursor-pointer rounded-md ${currentHighlightedFile === item.id ? "bg-accent" : ""} `}
                    data-id={item.id} // store the unique id of file
                    data-filetype={fileType}
                    data-name={item.name}
                    data-url={item.fileUrl}
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
                      setFileToRenameId(null);
                      reset();
                    }}
                    onDoubleClick={(e) => {
                      if (e.currentTarget.dataset.filetype === "Folder") {
                        addFolderToHistory(item.id, item.name);
                      } else if (e.currentTarget.dataset.filetype === "Image") {
                        setImagePreviewOpen(true);
                      } else if (e.currentTarget.dataset.filetype === "PDF") {
                        setPdfPreviewOpen(true);
                      }
                      setFileToRenameId(null);
                      reset();
                    }}
                    onClick={(e) => {
                      setCurrentHighlightedFile(e.currentTarget.dataset.id as string);
                      if (e.currentTarget.dataset.filetype === "Image") {
                        setCurrentImagePreviewUrl(e.currentTarget.dataset.url as string);
                      } else if (e.currentTarget.dataset.filetype === "PDF") {
                        setCurrentPdfPreviewUrl(e.currentTarget.dataset.url as string);
                      }
                    }}
                  >
                    {item.thumbnailUrl ? (
                      <Image src={item.thumbnailUrl} width={64} height={64} alt="icon" />
                    ) : (
                      <Image src={icon} width={64} height={64} alt="icon" />
                    )}
                    <ScrollArea className="max-w-35 h-10">
                      {fileToRenameId === item.id ? (
                        <form
                          onSubmit={handleSubmit((data) =>
                            renameFile(item.id, data.newName),
                          )}
                        >
                          <Input
                            defaultValue={item.name}
                            {...register("newName")}
                            type="text"
                            autoComplete="off"
                            autoFocus
                          />
                        </form>
                      ) : (
                        <p>{item.name}</p>
                      )}
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
                  <DropdownMenuSeparator />
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
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            addToFav(selectedFileForAction?.id as string);
                          }}
                        >
                          Add to Fav
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a href={`/api/file/${selectedFileForAction?.id}/download`}>
                            Download
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        addToTrash(selectedFileForAction?.id as string);
                      }}
                    >
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      const fileId = selectedFileForAction?.id;
                      if (fileId) setFileToRenameId(fileId);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <ImagePreview
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        fileUrl={currentImagePreviewUrl}
      />
      <PdfPreviewModal
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        fileUrl={currentPdfPreviewUrl}
      />
    </Card>
  );
}

export default AllFiles;
