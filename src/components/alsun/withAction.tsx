"use client";

import {
  ConfirmDialogOptions,
  useConfirmationDialog,
} from "@/components/ui/modifiedcn/dialogContext";
import useAction from "@/hooks/use-action";
import { Result } from "@/lib/types/util";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
wrap components that call backend actions in a client boundry that handles confirm and loading and toasts any errors

by default it also !refreshes the page! to refresh server side mutations
*/
export function WithActionOnClick<T>({
  beforeAction,
  action,
  children,
  confirmationOptions,
  onSuccess,
  onFail,
}: {
  beforeAction?: () => boolean;
  action: () => Promise<Result<T>>;
  children: React.ReactNode;
  confirmationOptions?: ConfirmDialogOptions;
  onSuccess?: (t: T) => void;
  onFail?: (e: string) => void;
}) {
  const { confirm } = useConfirmationDialog();
  const router = useRouter();

  const { start: startAction, isLoading } = useAction<void, T>(action, {
    beforeAction,
    onSuccess: (t) => (onSuccess ? onSuccess(t) : router.refresh()),
    onFail: (e) => (onFail ? onFail(e) : toast.error(e)),
  });

  return (
    <div
      className={
        "transition-opacity" + (isLoading ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
      }
      onClick={async () => {
        if (isLoading) return;
        if (confirmationOptions && !(await confirm(confirmationOptions))) return;
        startAction();
      }}
    >
      {children}
    </div>
  );
}

/**
wrap forms that submit to backend actions in a client boundry that handles confirm and loading and toasts any errors

by default it also !refreshes the page! to refresh server side mutations
*/
export function WithActionOnSubmit<T>({
  beforeAction,
  action,
  children,
  confirmationOptions,
  onSuccess,
  onFail,
  dontSubmitOnEnter,
}: {
  beforeAction?: (formData: FormData) => boolean;
  action: (formData: FormData) => Promise<Result<T>>;
  children: React.ReactNode;
  confirmationOptions?: ConfirmDialogOptions;
  onSuccess?: (t: T) => void;
  onFail?: (e: string) => void;
  dontSubmitOnEnter?: boolean;
}) {
  const { confirm } = useConfirmationDialog();
  const router = useRouter();
  const { start: startAction, isLoading } = useAction<FormData, T>(action, {
    beforeAction,
    onSuccess: (t) => (onSuccess ? onSuccess(t) : router.refresh()),
    onFail: (e) => (onFail ? onFail(e) : toast.error(e)),
  });

  return (
    <form
      className={
        "transition-opacity" +
        (isLoading ? " opacity-50 cursor-not-allowed pointer-events-none" : "")
      }
      onKeyDown={(e) => {
        if (dontSubmitOnEnter && e.key === "Enter") e.preventDefault();
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        if (isLoading) return;
        if (confirmationOptions && !(await confirm(confirmationOptions))) return;
        const formData = new FormData(e.currentTarget);
        startAction(formData);
      }}
    >
      {children}
    </form>
  );
}
