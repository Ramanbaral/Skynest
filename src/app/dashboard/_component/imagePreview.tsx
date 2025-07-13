import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface IImagePreviewProps {
  fileUrl: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function ImagePreview({ fileUrl, open, onOpenChange }: IImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[60vw] h-[70vh] overflow-hidden">
        <DialogTitle className="hidden">Image Preview</DialogTitle>
        {fileUrl && <img className="mt-3" src={fileUrl} alt="img" />}
      </DialogContent>
    </Dialog>
  );
}
