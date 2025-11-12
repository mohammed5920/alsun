import { Logo } from "@/components/alsun/logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-3 py-8">
      <div className="mx-4 md:mx-8 max-w-lg space-y-4 rounded-2xl bg-white/20 p-6 text-balance text-center shadow-md backdrop-blur-[3px]">
        <div className="mx-auto w-fit">
          <Logo />
        </div>

        <h2 className="mx-auto w-fit text-sm font-bold uppercase tracking-widest text-primary">
          Page Not Found
        </h2>

        <p>
          <Link href="/" className="underline text-primary">
            Click here
          </Link>{" "}
          to go home, or <br />
          <Link href="/contact" className="underline text-primary">
            click here
          </Link>{" "}
          to contact us if you think this was an error.
        </p>
      </div>
    </div>
  );
}
