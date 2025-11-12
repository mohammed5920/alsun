/* eslint-disable @next/next/no-img-element */

export default function Loading() {
  return (
    <div className="animate-out blur-out-sm fill-mode-forwards absolute inset-0 flex transform-gpu items-center justify-center duration-3000">
      <div className="animate-in fade-in from-secondary to-primary bg-linear-to-r mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2X9c6yJYRqlLMn7mjPCpJITryBwV8txkA3z0Q)] mask-no-repeat duration-300">
        <img
          src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2X9c6yJYRqlLMn7mjPCpJITryBwV8txkA3z0Q"
          alt={"loading"}
          className="opacity-0"
        />
      </div>
    </div>
  );
}
