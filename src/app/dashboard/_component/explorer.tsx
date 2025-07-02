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
  DownloadCloud,
  FileIcon,
  LucideHome,
  PlusSquare,
  StarOff,
  Trash2,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
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
import { useState } from "react";

export default function Explorer() {
  const filesAndFolders = [
    {
      name: "Resumes",
      type: "folder",
    },
    {
      name: "Vacation Pokhara Pokhara PokharaPokharaPokhara",
      type: "folder",
    },
    {
      name: "test.jpg",
      type: "image",
    },
    {
      name: "doc.pdf",
      type: "pdf",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
    {
      name: "test.png",
      type: "image",
    },
  ];

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
                    <Button><PlusSquare /> New Folder</Button>
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
              {filesAndFolders.length === 0 ? (
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
                    {filesAndFolders.map((item, ind) => {
                      let icon = "/folder.png";
                      if (item.type === "folder") {
                        icon = "/folder.png";
                      } else if (item.type === "image") {
                        icon = "/picture.png";
                      } else if (item.type === "pdf") {
                        icon = "/pdf.png";
                      }

                      return (
                        <div
                          key={ind}
                          className="flex flex-col gap-3 items-start cursor-pointer"
                          data-id={item.name} // store the unique id of file
                          onContextMenu={(e) => {
                            e.preventDefault();
                            console.log(e.currentTarget.dataset.id);
                            setIsMenuOpen(!isMenuOpen);
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                          }}
                          onDoubleClick={(e) => {
                            console.log(e.currentTarget);
                          }}
                        >
                          <Image src={icon} width={64} height={64} alt="icon" />
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
