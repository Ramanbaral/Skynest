import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface IImagePreviewProps {
  imageUrl: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function ImagePreview({ imageUrl, open, onOpenChange }: IImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogTitle>{""}</DialogTitle>
        {imageUrl && <img className="mt-3" src={imageUrl} alt="img" />}
      </DialogContent>
    </Dialog>
  );
}
