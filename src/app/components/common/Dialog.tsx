import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import React, { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  children: ReactNode;
  submitBtnTitle: string;
  onSubmit: (...params: any[]) => Promise<void> | void;
  onClose: (...params: any[]) => void;
};

export function DialogCustom({
  open,
  children,
  description,
  title,
  submitBtnTitle,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open === false) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            type="submit"
            onClick={async () => {
              await onSubmit();
              onClose();
            }}
          >
            {submitBtnTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
