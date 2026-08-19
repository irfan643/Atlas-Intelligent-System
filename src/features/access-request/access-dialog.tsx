"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AccessWizard } from "./access-wizard";

export function AccessDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setResetKey((key) => key + 1);
        }
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-auto rounded-3xl p-8 sm:max-w-[680px]"
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Atlas access</DialogTitle>
          <DialogDescription>
            Request approved access to Atlas.
          </DialogDescription>
        </DialogHeader>
        <AccessWizard key={resetKey} />
      </DialogContent>
    </Dialog>
  );
}
