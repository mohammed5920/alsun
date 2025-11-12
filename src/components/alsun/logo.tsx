/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function Logo({ hideText, isDark }: { hideText?: boolean; isDark?: boolean }) {
  return (
    <Link href="/" className="size-fit">
      <div className="transition-all duration-500 hover:scale-105">
        <div
          className={`from-primary ${isDark ? "to-cyan-900" : "to-secondary"} ${isDark ? "hover:from-cyan-900" : "hover:from-secondary"} hover:to-primary flex items-center justify-center gap-2 rounded-3xl bg-linear-to-l p-2.5 px-3 text-slate-100 transition-colors duration-500`}
        >
          <img
            src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2X9c6yJYRqlLMn7mjPCpJITryBwV8txkA3z0Q"
            width={30}
            alt="Alsun Logo"
          />
          {!hideText && <h1 className="font-alsun text-lg">الألسن</h1>}
        </div>
      </div>
    </Link>
  );
}

export function InvertedLogo({ hideText }: { hideText?: boolean }) {
  return (
    <Link href="/" className="transition-all duration-500 hover:scale-105">
      <div className="flex items-center justify-center gap-2">
        <div className="relative">
          <div className="bg-secondary absolute size-full mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2X9c6yJYRqlLMn7mjPCpJITryBwV8txkA3z0Q)] mask-contain" />
          <img
            src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2X9c6yJYRqlLMn7mjPCpJITryBwV8txkA3z0Q"
            width={30}
            alt="Alsun Logo"
            className="relative rounded-4xl opacity-0 brightness-20"
          />
        </div>
        {!hideText && <h1 className="font-alsun text-secondary text-lg">الألسن</h1>}
      </div>
    </Link>
  );
}
