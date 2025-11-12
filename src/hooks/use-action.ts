import { Result } from "@/lib/types/util";
import { useState } from "react";

/**
  use an action that returns a result type and handle loading and error automatically
*/
export default function useAction<T, R>(
  action: (args: T) => Promise<Result<R>>,
  callbacks: {
    beforeAction?: (args: T) => boolean;
    onSuccess?: (result: R) => void;
    onFail?: (error: string) => void;
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const { beforeAction, onSuccess, onFail } = callbacks;

  const start = async (args: T) => {
    if (beforeAction && !beforeAction(args)) return;
    setIsLoading(true);
    try {
      const res = await action(args);
      if (!res.ok) return onFail?.(res.error);
      onSuccess?.(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
        throw e;
      } else onFail?.("Server error");
    } finally {
      setIsLoading(false);
    }
  };
  return { start, isLoading };
}
