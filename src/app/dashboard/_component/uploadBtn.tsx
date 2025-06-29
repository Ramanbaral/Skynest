"use client";
import Image from "next/image";
import { useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus2, ImagePlus, Upload, UploadCloud } from "lucide-react";
import { toast } from "sonner";

function UploadButton() {
  const addImageInp = useRef<HTMLInputElement | null>(null);
  const addDocInp = useRef<HTMLInputElement | null>(null);
  const addFileInp = useRef<HTMLInputElement | null>(null);

  const MaxFileSizeInBytes = 5 * 1024 * 1024; //5MB

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="cursor-pointer">
            <Image src={"/uplaod.png"} width={30} height={30} alt="U" />
            <span className="text-lg font-semibold text-green-500">UPLOAD</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Your File</DialogTitle>
            <DialogDescription>
              Store your files in personal cloud storage.
            </DialogDescription>
          </DialogHeader>

          <div>
            <input
              ref={addImageInp}
              type="file"
              accept="image/*"
              className="absolute right-[9999px]"
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files?.item(0)?.size > MaxFileSizeInBytes) {
                  toast.error("File Size should be less than 5 MB.");
                }
              }}
            />
            <Button
              onClick={() => {
                addImageInp.current?.click();
              }}
            >
              <ImagePlus /> Add Image
            </Button>
            <input
              ref={addDocInp}
              type="file"
              accept=".pdf,.doc,.docx"
              className="absolute right-[9999px]"
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files?.item(0)?.size > MaxFileSizeInBytes) {
                  toast.error("File Size should be less than 5 MB.");
                }
              }}
            />
            <Button
              className="mx-3"
              onClick={() => {
                addDocInp.current?.click();
              }}
            >
              <FilePlus2 /> Add Doc
            </Button>
            <div className="grid place-content-center">
              <div className="flex flex-col items-center justify-center gap-1 w-[25rem] h-[15rem] border border-dashed border-gray-400 my-5 rounded-md">
                <UploadCloud size={64} className="text-green-400" />
                <p className="font-semibold">
                  Drag and drop your image, pdf here, or{" "}
                  <input
                    ref={addFileInp}
                    type="file"
                    accept="image/*, .pdf, .doc, .docx"
                    className="absolute right-[9999px]"
                    onChange={(e) => {
                      console.log(e.target.files);
                      const files = e.target.files;

                      for (const file of files) {
                        console.log(file?.size);
                        if (file?.size > MaxFileSizeInBytes) {
                          toast.error("File Size should be less than 5 MB.");
                        }
                      }
                    }}
                    multiple
                  />
                  <a
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      addFileInp.current?.click();
                    }}
                  >
                    browse
                  </a>
                </p>
                <p className="text-sm">File up to 5MB</p>
              </div>

              <Button className="cursor-pointer">
                <Upload /> Upload
              </Button>
            </div>

            <div className="flex flex-col text-sm mt-4">
              <span>Tips:</span>
              <span>- Files are private and only visible to you</span>
              <span>- Supported formats JPG, PNG, GIF, WebP, Pdf</span>
              <span>- Maximum file size: 5MB</span>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default UploadButton;
