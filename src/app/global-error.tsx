"use client";

import { Logo } from "@/components/alsun/logo";
import useAction from "@/hooks/use-action";
import { sendError } from "@/lib/actions/general";
import { useEffect, useState } from "react";
import "./globals.css";

export default function Error({ error }: { error: unknown }) {
  const stringified = JSON.stringify(error, Object.getOwnPropertyNames(error));
  const [serverError, setServerError] = useState(
    typeof stringified === "undefined" ? "Cannot parse error." : ""
  );
  const { start: startReporting, isLoading } = useAction(sendError, {
    onFail(e) {
      setServerError(e);
    },
  });

  useEffect(() => {
    const send = async () => {
      if (!serverError) startReporting(stringified);
    };
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className="font-alsun-sans relative min-h-screen bg-slate-100">
        <div className="bg-secondary absolute inset-0 -z-10 size-full mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2dCMVhXIQiv4Ho2zOKhY7LtSCkgBanMNcl6AF)] opacity-7" />
        <div className="flex items-center justify-center min-h-screen flex-3 py-8">
          <div className="mx-4 md:mx-8 max-w-lg space-y-4 rounded-2xl bg-white/20 p-6 text-balance text-center shadow-md backdrop-blur-[3px]">
            <div className="mx-auto w-fit">
              <Logo />
            </div>

            <h2 className="mx-auto w-fit text-sm font-bold uppercase tracking-widest text-primary">
              ERROR :(
            </h2>

            {isLoading ? (
              <p>Please wait while we report the issue...</p>
            ) : serverError ? (
              <p>Another error occured while reporting: {serverError}.</p>
            ) : (
              <p>Error has been reported successfully.</p>
            )}

            <p>
              <button
                onClick={() => (window.location.href = "/")}
                className="underline text-primary cursor-pointer"
              >
                Click here
              </button>{" "}
              to go home.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
