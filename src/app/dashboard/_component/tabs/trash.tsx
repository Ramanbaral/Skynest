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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpFromLine, Trash2, X } from "lucide-react";

function Trash() {
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
  );
}

export default Trash;
