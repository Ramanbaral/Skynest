"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface IPdfPreviewProps {
  fileUrl: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function PdfPreviewModal({ fileUrl, open, onOpenChange }: IPdfPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-10xl h-[90vh] overflow-hidden p-0">
        <DialogTitle className="hidden">PDF Preview</DialogTitle>
        {fileUrl && (
          <iframe src={fileUrl} className="w-full h-full" title="PDF Preview" />
        )}
      </DialogContent>
    </Dialog>
  );
}
