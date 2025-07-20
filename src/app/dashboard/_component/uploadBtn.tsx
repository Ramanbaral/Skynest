"use client";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  File as FileIcon,
  FilePlus2,
  ImageIcon,
  ImagePlus,
  Upload,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useFilesAndFoldersStore } from "@/providers/filesAndFoldersStoreProvider";
import { useUploadBtnRefStore } from "@/stores/uploadBtnRefStore";
import Loader from "./loader";

function UploadButton() {
  const MaxFileSizeInBytes = 5 * 1024 * 1024; //5MB

  const addImageInp = useRef<HTMLInputElement | null>(null);
  const addDocInp = useRef<HTMLInputElement | null>(null);
  const addFileInp = useRef<HTMLInputElement | null>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const dialogClose = useRef<HTMLButtonElement>(null);

  const [files, setFiles] = useState<FileList | File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addFilesAndFolders } = useFilesAndFoldersStore((state) => state);

  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");

  const setUploadBtnRef = useUploadBtnRefStore((state) => state.setBtnRef);
  useEffect(() => {
    setUploadBtnRef(uploadBtnRef);
  }, [uploadBtnRef]);

  const uploadFile = async () => {
    setIsUploading(true);
    try {
      if (files === null) throw new Error("No files to Uplaod.");
      const file = files[0] as File;
      const data = new FormData();
      data.set("file", file);
      data.set("userId", userId as string);
      if (parentId) data.set("parentId", parentId);

      const uploadReq = await axios.post("/api/upload-file", data);
      if (uploadReq.data.success) {
        toast.success("File Uploaded ✓", { position: "top-right" });
        dialogClose.current?.click();
        addFilesAndFolders(uploadReq.data.newFile);
      } else {
        toast.error(uploadReq.data.message, { position: "top-center" });
      }
      setFiles(null);
    } catch (e) {
      if (e instanceof AxiosError)
        toast.error(e.response?.data.message, { position: "top-center" });
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Only Images and PDF File are supported.");
      return;
    }
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  const onDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setFiles(null);
    }
  };

  return (
    <Dialog onOpenChange={onDialogClose}>
      <form>
        <DialogTrigger asChild>
          <Button
            ref={uploadBtnRef}
            variant="outline"
            size="lg"
            className="cursor-pointer"
          >
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
                const img = e.target.files?.item(0);
                if (img && img?.size > MaxFileSizeInBytes) {
                  toast.error("File Size should be less than 5 MB.");
                } else {
                  setFiles(e.target.files);
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
                const doc = e.target.files?.item(0);
                if (doc && doc?.size > MaxFileSizeInBytes) {
                  toast.error("File Size should be less than 5 MB.");
                } else {
                  setFiles(e.target.files);
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
              <div
                className={`flex flex-col items-center justify-center gap-1 w-[25rem] h-[15rem] border border-dashed border-gray-400 mt-5 rounded-md ${
                  files !== null ? "hidden" : ""
                }`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <UploadCloud size={64} className="text-green-400" />
                {isDragActive ? (
                  <p>Drop the file here ....</p>
                ) : (
                  <p className="font-semibold">
                    Drag and drop your image, pdf here, or{" "}
                    <input
                      ref={addFileInp}
                      type="file"
                      accept="image/*, .pdf, .doc, .docx"
                      className="absolute right-[9999px]"
                      onChange={(e) => {
                        const file = e.target.files?.item(0);

                        if (file && file?.size > MaxFileSizeInBytes) {
                          toast.error("File Size should be less than 5 MB.");
                        } else {
                          setFiles(e.target.files);
                        }
                      }}
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
                )}
                <p className="text-sm">File up to 5MB</p>
              </div>

              {/* selected files container  */}
              {files && (
                <div className="w-[25rem] flex flex-col gap-2 border rounded-md my-5 p-2">
                  <div className="relative w-full flex items-center gap-5 p-2 border border-primary rounded-md">
                    {files[0]?.type == "application/pdf" ? (
                      <FileIcon size={44} />
                    ) : (
                      <ImageIcon size={44} />
                    )}
                    <div>
                      <p className=" overflow-hidden font-semibold">
                        {(files[0]?.name.length ?? 0) < 30
                          ? files[0]?.name
                          : files[0]?.name.substring(0, 30) + "..."}
                      </p>
                      <p className="text-sm">
                        {((files[0]?.size ?? 1) / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="cursor-pointer mt-5"
                disabled={files === null}
                onClick={uploadFile}
              >
                {isUploading ? (
                  <>
                    <Loader /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload /> Upload
                  </>
                )}
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
        <DialogClose ref={dialogClose}></DialogClose>
      </form>
    </Dialog>
  );
}

export default UploadButton;
