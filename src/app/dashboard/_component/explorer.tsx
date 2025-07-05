"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowUpFromLine,
  CircleX,
  DownloadCloud,
  FileIcon,
  LucideHome,
  StarOff,
  Trash2,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { File } from "@/db/schema";
import { toast } from "sonner";
import CreateFolder from "./createFolder";
import { useFilesAndFoldersStore } from "@/providers/filesAndFoldersStoreProvider";

export default function Explorer() {
  const router = useRouter();
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV008",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV0013",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV0010",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV0011",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV0012",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

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
  const [selectedFileForAction, setSelectedFileForAction] = useState<string | null>(null);
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
    <div className="flex flex-col gap-6 mx-10 mt-5">
      <Tabs defaultValue="allfiles">
        <div className="grid place-content-center">
          <TabsList className="">
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
                <div role="status" className="place-self-center m-10">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
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
                          onContextMenu={(e) => {
                            e.preventDefault();
                            console.log(e.currentTarget.dataset.id);
                            setCurrentHighlightedFile(
                              e.currentTarget.dataset.id as string,
                            );
                            setSelectedFileForAction(
                              e.currentTarget.dataset.id as string,
                            );
                            setIsMenuOpen(!isMenuOpen);
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                          }}
                          onDoubleClick={(e) => {
                            if (e.currentTarget.dataset.filetype === "folder") {
                              addFolderToHistory(item.id, item.name);
                            }
                          }}
                          onClick={(e) => {
                            setCurrentHighlightedFile(
                              e.currentTarget.dataset.id as string,
                            );
                          }}
                        >
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              width={64}
                              height={64}
                              alt="icon"
                            />
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
                          <DropdownMenuItem>Open</DropdownMenuItem>
                          <DropdownMenuItem>
                            Add to Fav
                            <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Move to Trash
                            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
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
        </TabsContent>
        <TabsContent value="favourite">
          <Card>
            <CardHeader>
              <CardTitle>Favourite Files</CardTitle>
              <CardDescription>
                See all your favourite and important files in one place.
              </CardDescription>
            </CardHeader>
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
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Image src="/pdf.png" width={64} height={64} alt="img" />
                          headshot.jpg
                        </TableCell>
                        <TableCell>Image/Png</TableCell>
                        <TableCell>2.2 MB</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trash">
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
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Image src="/pdf.png" width={64} height={64} alt="img" />
                          headshot.jpg
                        </TableCell>
                        <TableCell>Image/Png</TableCell>
                        <TableCell>2.2 MB</TableCell>
                        <TableCell className="text-right">
                          <div>
                            <Button variant="outline" className="mx-2">
                              <ArrowUpFromLine className="text-green-400" />
                              Restore
                            </Button>
                            <Button variant="outline" className="mx-2">
                              <X className="text-destructive" /> Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
