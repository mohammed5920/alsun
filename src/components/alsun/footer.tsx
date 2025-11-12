import { SiFacebook, SiWhatsapp } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary relative py-4 text-white">
      <div className="mx-auto mb-4 md:mb-0 md:absolute inset-0 pointer-events-none flex gap-3 size-fit items-center justify-center md:size-full text-slate-500">
        <a target="_blank" href="https://www.facebook.com/alalsun.academy.languages/">
          <SiFacebook className="size-5 pointer-events-auto hover:text-blue-500 transition-colors" />
        </a>
        <a target="_blank" href="https://wa.me/+201030483636">
          <SiWhatsapp className="size-5 pointer-events-auto hover:text-green-700 transition-colors" />
        </a>
      </div>
      <div className="z-10 mx-auto flex max-w-7xl flex-col items-center justify-between px-8 text-sm text-slate-500 md:flex-row">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Al-Alsun Academy. All rights reserved.
        </p>
        <div className="mt-4 flex items-center gap-4 md:mt-0">
          <span className="font-alsun-serif hover:to-primary pointer-events-auto cursor-pointer bg-linear-to-r from-slate-500 to-slate-500 bg-clip-text font-bold tracking-tighter text-transparent transition-colors duration-500 hover:from-cyan-900">
            <Link href={"/mbm"}>mbm.</Link>
          </span>
          <Link href="/privacy" className="text-center hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-center hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
