"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

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

function UploadButton() {
  const MaxFileSizeInBytes = 5 * 1024 * 1024; //5MB

  const addImageInp = useRef<HTMLInputElement | null>(null);
  const addDocInp = useRef<HTMLInputElement | null>(null);
  const addFileInp = useRef<HTMLInputElement | null>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const dialogClose = useRef<HTMLButtonElement>(null);

  const [files, setFiles] = useState<FileList | null>(null);
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
      const file = files?.item(0) as File;
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

  return (
    <Dialog>
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
              >
                <UploadCloud size={64} className="text-green-400" />
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
                <p className="text-sm">File up to 5MB</p>
              </div>

              {/* selected files container  */}
              {files && (
                <div className="w-[25rem] flex flex-col gap-2 border rounded-md my-5 p-2">
                  <div className="relative w-full flex items-center gap-5 p-2 border border-primary rounded-md">
                    {files.item(0)?.type == "application/pdf" ? (
                      <FileIcon size={44} />
                    ) : (
                      <ImageIcon size={44} />
                    )}
                    <div>
                      <p className=" overflow-hidden font-semibold">
                        {(files.item(0)?.name.length ?? 0) < 30
                          ? files.item(0)?.name
                          : files.item(0)?.name.substring(0, 30) + "..."}
                      </p>
                      <p className="text-sm">
                        {((files.item(0)?.size ?? 1) / (1024 * 1024)).toFixed(2)} MB
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
                  <div role="status" className="flex gap-3 m-2">
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
                    Uploading
                  </div>
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
