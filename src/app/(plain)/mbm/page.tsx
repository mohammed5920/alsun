import { Logo } from "@/components/alsun/logo";
import Link from "next/link";

export default function MBM() {
  return (
    <div className="flex min-h-screen w-screen flex-col md:flex-row-reverse">
      <div className="-z-15 flex items-center bg-secondary md:flex-1 text-center md:text-left">
        <div className="absolute inset-0 -z-10 size-full bg-white/30 mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2dCMVhXIQiv4Ho2zOKhY7LtSCkgBanMNcl6AF)] opacity-30" />
        <header className="z-10 -space-y-2 p-3 font-alsun-serif text-6xl tracking-[-6] text-white mx-auto md:mx-0">
          <p>made</p> <p>by</p> <p>mohammed.</p>
        </header>
      </div>
      <div className="flex items-center justify-center flex-3 py-8">
        <div className="mx-4 md:mx-8 max-w-lg space-y-4 rounded-2xl bg-white/20 p-6 text-balance text-center shadow-md backdrop-blur-[3px]">
          <div className="mx-auto w-fit">
            <Logo />
          </div>

          <h2 className="mx-auto w-fit text-sm font-bold uppercase tracking-widest text-primary">
            Project Alsun
          </h2>

          <p>
            Project Alsun is a CMS-lite custom designed for{" "}
            <Link className="text-primary underline font-bold" href={"/contact"}>
              Al-Alsun Academy
            </Link>{" "}
            from scratch to serve their unique hybrid learning model.
          </p>

          <p>
            It's designed to be fast, leveraging the latest React server-side paradigms to minimize
            database round-trips while maintaining rich and interactive user experiences.
            <br /> Most pages on this site perform only a single database query.
          </p>

          <p>
            It's also designed to be deployed effortlessly while costing <strong>$0</strong> to
            host. The architecture is entirely serverless, using a curated stack of modern tools:
            <br />
            <strong>Next.js</strong>, <strong>Prisma ORM</strong>, <strong>Supabase</strong> for the
            database, <strong>UploadThing</strong> for file storage, and hosted on{" "}
            <strong>Netlify</strong>.
          </p>

          <p className="pt-2">
            If you're interested in building things like this, I'd love to connect.
          </p>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <a
              href="mailto:mohammednasrelsayed@gmail.com"
              className="font-semibold text-teal-600 underline"
            >
              Email
            </a>
            <a
              href="https://github.com/mohammed5920"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-600 underline"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mohammed-nasr-elsayed"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-600 underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
