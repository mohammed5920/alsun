import { Logo } from "@/components/alsun/logo";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="absolute right-0 left-0 z-50 mx-auto w-fit p-4 md:mx-0">
        <Logo />
      </div>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-12">
        <div className="border-primary mx-auto flex w-fit max-w-[85vw] flex-col items-center justify-center rounded-2xl border bg-white/20 p-5 shadow-md backdrop-blur-[1px] md:p-10">
          {children}
        </div>
      </div>
    </>
  );
}
