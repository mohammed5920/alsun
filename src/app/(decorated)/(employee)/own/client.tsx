"use client";

import { WithActionOnSubmit } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { grantOwner } from "@/lib/actions/user";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OwnerChallenge() {
  const router = useRouter();
  return (
    <div className="flex size-full items-center justify-center animate-in fade-in transform-gpu duration-500">
      <div className="p-4 rounded-2xl backdrop-blur-md shadow-md border border-white/20 bg-white/20 uppercase tracking-widest text-center">
        <span className="mb-4 block">Enter the master password:</span>

        <WithActionOnSubmit
          action={(formData) => grantOwner(formData.get("password") as string)}
          onSuccess={async () => {
            await authClient.getSession({
              query: {
                disableCookieCache: true,
              },
            });
            authClient.$store.notify("$sessionSignal");
            toast.success("Welcome back!");
            router.refresh();
          }}
        >
          <div className="flex gap-2">
            <Input name="password" type="password"></Input>
            <Button type="submit">Submit</Button>
          </div>
        </WithActionOnSubmit>
      </div>
    </div>
  );
}

export function ErrorCauser() {
  const [error, causeError] = useState(false);
  if (error) throw new Error("test error");
  return (
    <button onClick={() => causeError(true)} className="underline text-red-600 cursor-pointer">
      Error
    </button>
  );
}
