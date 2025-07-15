"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusSquare, X } from "lucide-react";

import { folderNameSchema } from "@/schemas/createNewFolderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v4";
import axios from "axios";
import { toast } from "sonner";
import { useFilesAndFoldersStore } from "@/providers/filesAndFoldersStoreProvider";

export default function CreateFolder() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");

  const { addFilesAndFolders } = useFilesAndFoldersStore((state) => state);

  const formSchema = z.object({
    folderName: folderNameSchema,
  });

  type formData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<formData>({
    resolver: zodResolver(formSchema),
  });

  const onCreateFolderFormSubmit = async (data: { folderName: string }) => {
    try {
      const userId = user?.id;

      const createFolderResponse = await axios.post("/api/folder/create", {
        name: data.folderName,
        userId,
        parentId,
      });

      if (createFolderResponse.data.success) {
        toast.success(`New Folder: ${data.folderName} ✓`, {
          position: "top-center",
        });
        //display new folder to user
        addFilesAndFolders(createFolderResponse.data.folder);
      }
    } catch {
      toast.error(`Problem Creating Folder`, {
        position: "top-center",
      });
    } finally {
      reset();
    }
  };

  return (
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
            <AlertDialogDescription asChild>
              <form onSubmit={handleSubmit(onCreateFolderFormSubmit)}>
                <div className="flex w-full max-w-sm items-center gap-4">
                  <Input
                    {...register("folderName", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Folder Name"
                    autoComplete="off"
                    autoFocus
                  />
                  <AlertDialogAction type="submit" disabled={!isValid}>
                    <PlusSquare /> Create
                  </AlertDialogAction>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
