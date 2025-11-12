import { Logo } from "@/components/alsun/logo";
import { WithActionOnClick } from "@/components/alsun/withAction";
import { enrollUser } from "@/lib/actions/user";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { ModuleVariantType } from "@prisma/client";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { moduleId, type } = await searchParams;
  if (typeof moduleId !== "string" || !moduleId) redirect("/");
  if (typeof type !== "string" || !type) redirect("/");

  const user = await readUser();
  if (!user) {
    const callbackUrl = `/checkout?moduleId=${moduleId}&type=${type}`;
    redirect(`/signup?redirect=${encodeURIComponent(callbackUrl)}`);
  }

  const mod = await prisma.module.findFirst({
    where: {
      moduleId: moduleId,
      variants: { some: { variantType: type as ModuleVariantType } },
      course: { isPublic: true },
    },
    include: {
      course: {
        select: { title: true },
      },
      enrollments: {
        where: { student: { id: user.id } },
        select: { enrollmentId: true },
      },
      variants: {
        where: { variantType: type as ModuleVariantType },
      },
    },
  });

  if (!mod) redirect("/");
  if (mod.enrollments.length > 0) redirect(`/learn/${mod.moduleId}`);

  return (
    <div className="animate-in fade-in flex min-h-screen w-screen transform-gpu flex-col items-center justify-center duration-500">
      <div className="top-2 right-0 left-0 mx-auto w-fit pt-6 md:absolute">
        <Logo />
      </div>
      <div className="flex min-w-screen grow items-center justify-center">
        <div className="flex w-screen max-w-6xl flex-col items-center justify-between gap-2 p-6 md:flex-row">
          <div className="w-full flex-1 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
            <h1 className="text-secondary font-alsun-serif text-center text-2xl font-bold">
              Order Summary
            </h1>
            <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Course:</span>
                <span className="font-semibold">{mod.course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Module:</span>
                <span className="font-semibold">{mod.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Format:</span>
                <span className="font-semibold">{mod.variants[0].variantType}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
                <span className="text-secondary">Total:</span>
                <span className="text-primary">EGP{mod.variants[0].price}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 rounded-2xl bg-white/20 p-8 text-center shadow-md backdrop-blur-sm">
            <div>
              <h2 className="font-alsun-serif text-secondary text-2xl font-bold">
                Ready to Enroll?
              </h2>
              <p className="mt-2 text-slate-600">
                You will be redirected to our secure payment partner, PayTabs, to complete your
                purchase.
              </p>
            </div>

            <WithActionOnClick
              action={async () => {
                "use server";
                return enrollUser({
                  moduleId: mod!.moduleId,
                  variantType: type as ModuleVariantType,
                });
              }}
            >
              <button className="bg-primary shadow-primary/30 hover:bg-primary/90 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg p-3 px-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-60">
                Proceed <ArrowRight />
              </button>
            </WithActionOnClick>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
