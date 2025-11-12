"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createContext, ReactNode, useContext, useState } from "react";

export interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

interface DialogState extends ConfirmDialogOptions {
  resolve: (value: boolean) => void;
}

interface DialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ ...options, resolve });
    });
  };

  const handleClose = (confirmed: boolean) => {
    if (dialog) {
      dialog.resolve(confirmed);
      setDialog(null);
    }
  };

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      {dialog && (
        <AlertDialog open onOpenChange={() => handleClose(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-alsun-serif">
                {dialog.title ?? "Are you sure?"}
              </AlertDialogTitle>
              {dialog.description && (
                <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleClose(false)}>
                {dialog.cancelText ?? "No"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleClose(true)}>
                {dialog.confirmText ?? "Yes"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DialogContext.Provider>
  );
}

export function useConfirmationDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}
