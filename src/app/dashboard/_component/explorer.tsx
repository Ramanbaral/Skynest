"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowUpFromLine,
  DownloadCloud,
  FileIcon,
  LucideHome,
  PlusSquare,
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

export default function Explorer() {
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

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [filesAndFolders, setFilesAndFolders] = useState<File[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [selectedFileForAction, setSelectedFileForAction] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fetchFilesResponse: AxiosResponse<{
          success: boolean;
          message: string;
          files: File[];
        }> = await axios.get("/api/fetch-files");

        if (fetchFilesResponse.data.success) {
          setFilesAndFolders(fetchFilesResponse.data.files);
        }
      } catch (e) {
        console.log(e);
        toast.error("Problem Fetching Files!", { position: "top-center" });
      } finally {
        setFetchingFiles(false);
      }
    };
    fetchFiles();
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
                    <Button variant="outline">
                      <ArrowLeft size={64} />{" "}
                    </Button>
                    <Button className="ml-4">
                      <LucideHome /> Home
                    </Button>
                  </div>

                  <div className="mr-20">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <PlusSquare /> New Folder
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogCancel asChild>
                          <button className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100">
                            <X className="h-4 w-4" />
                          </button>
                        </AlertDialogCancel>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Create New Folder</AlertDialogTitle>
                          <AlertDialogDescription>
                            {/* use react hook form to submit form and create a folder (api route - /api/folder/create)  */}
                            <div className="flex w-full max-w-sm items-center gap-4">
                              <Input
                                type="text"
                                placeholder="Folder Name"
                                autoFocus
                              />
                              <AlertDialogAction type="submit">
                                <PlusSquare /> Create
                              </AlertDialogAction>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="mt-5">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/">Home</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
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
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/docs/components">Components</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
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
              ) : filesAndFolders.length === 0 ? (
                <div className="flex flex-col gap-2 items-center justify-center">
                  <FileIcon size={64} className="text-primary" />
                  <p className="font-semibold">No files available</p>
                  <p className="text-sm">
                    Upload your first file to get started with your personal
                    cloud storage
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
                          className="flex flex-col gap-3 items-center cursor-pointer"
                          data-id={item.id} // store the unique id of file
                          onContextMenu={(e) => {
                            e.preventDefault();
                            console.log(e.currentTarget.dataset.id);
                            setSelectedFileForAction(
                              e.currentTarget.dataset.id as string
                            );
                            setIsMenuOpen(!isMenuOpen);
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                          }}
                          onDoubleClick={(e) => {
                            console.log(e.currentTarget);
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
                            <Image
                              src={icon}
                              width={64}
                              height={64}
                              alt="icon"
                            />
                          )}
                          <ScrollArea className="max-w-35 h-10">
                            <p>{item.name}</p>
                          </ScrollArea>
                        </div>
                      );
                    })}
                    <DropdownMenu
                      open={isMenuOpen}
                      onOpenChange={setIsMenuOpen}
                    >
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
                          <DropdownMenuItem>
                            Add to Fav
                            <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Move to Trash
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
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
                          <Image
                            src="/pdf.png"
                            width={64}
                            height={64}
                            alt="img"
                          />
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
                          <Image
                            src="/pdf.png"
                            width={64}
                            height={64}
                            alt="img"
                          />
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
