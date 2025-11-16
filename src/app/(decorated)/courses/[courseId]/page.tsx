import { CourseHero } from "@/components/alsun/marketing/courseHero";
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { prisma } from "@/lib/prisma";
import { Module, ModuleVariant } from "@prisma/client";
import { ArrowRight, BookOpen, Users, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return (
    await prisma.course.findMany({ where: { isPublic: true }, select: { courseId: true } })
  ).map((c) => ({ courseId: c.courseId }));
}

export default async function CourseStorePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { courseId: courseId, isPublic: true },
    include: {
      tags: true,
      modules: { orderBy: { index: "asc" }, include: { variants: true } },
    },
  });
  if (!course) redirect("/courses");

  const perks = [
    {
      icon: Video,
      title: "Expert-Led Video Lessons",
      desc: "Engaging content from industry-leading instructors.",
    },
    {
      icon: BookOpen,
      title: "Real-World Experience",
      desc: "Practice with simulations mirroring actual challenges.",
    },
    {
      icon: Users,
      title: "Community Access",
      desc: "Connect with peers and instructors in our private community.",
    },
  ];

  return (
    <div className="animate-in fade-in transform-gpu text-slate-800 duration-500">
      <CourseHero course={course} />

      <section className="w-full bg-white p-12">
        <div className="mx-auto mb-6 text-center">
          <h2 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            What's Included
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="border-secondary/10 rounded-2xl border bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <perk.icon className="h-6 w-6" />
              </div>
              <h3 className="text-secondary mt-4 text-xl font-semibold">{perk.title}</h3>
              <p className="mt-2 text-slate-600">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center bg-white pb-12">
        <div className="bg-primary/10 border-primary/50 text-secondary relative max-w-6xl overflow-hidden md:rounded-3xl border p-4 py-16 md:mx-12 md:p-12 lg:p-16">
          <div className="bg-secondary/10 absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-50" />
          <div className="bg-secondary/10 absolute -bottom-24 -left-12 h-80 w-80 rounded-full opacity-50" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h3 className="text-primary tracking-widest uppercase">Our Mission</h3>
            <h2 className="font-alsun-serif mt-4 text-2xl font-bold text-balance md:text-4xl lg:text-5xl">
              Pioneering Education for a New Era.
            </h2>
            <p className="text-secondary/80 mt-6 md:text-lg text-balance px-4">
              We believe mastery comes from deep understanding, not just memorization. Our
              curriculum is meticulously designed by industry veterans to provide practical,
              real-world skills that empower you to not just succeed, but to lead. We are more than
              an institution; we are a community dedicated to lifelong growth and excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12" id="modules">
        <div className="mx-auto mb-16 max-w-3xl text-center px-4 text-balance">
          <h2 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            Explore the Curriculum
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Our course is structured into comprehensive modules. Dive into the details and choose
            the learning format that works best for you.
          </p>
        </div>

        <ModuleBrowser modules={course.modules} />
      </section>

      <section className="bg-secondary to-secondary relative w-full py-16 text-center">
        <div className="to-primary absolute h-[60%] w-full bg-linear-to-r from-orange-800 opacity-20 mix-blend-lighten blur-2xl"></div>
        <div className="px-8">
          <h2 className="font-alsun-serif mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-white md:text-5xl">
            Ready to Begin Your Transformation?
          </h2>
          <p className="mx-auto mt-6 text-balance max-w-2xl text-lg text-white/70">
            Invest in your future today. Enroll in a module and take the first step towards
            unlocking your full potential.
          </p>
        </div>
        <Link href="#modules">
          <button className="bg-secondary hover:bg-primary hover:shadow-primary/40 relative mx-auto mt-8 rounded-full px-8 py-4 text-lg font-light text-white transition-all duration-300 hover:font-semibold hover:tracking-wide hover:shadow-2xl">
            <span className="flex items-center">
              Explore Modules{" "}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </Link>
      </section>
    </div>
  );
}

function ModuleBrowser({ modules }: { modules: (Module & { variants: ModuleVariant[] })[] }) {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
      <div className="from-secondary to-primary absolute size-full bg-linear-to-r" />
      {modules.map((module, index) => (
        <div key={module.moduleId} className="relative z-1 my-1 w-full border border-slate-200/80">
          <div className="flex items-center justify-between bg-white p-6 text-left transition-colors duration-200">
            <div className="flex items-center gap-6">
              <span className="text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-bold">
                {index + 1}
              </span>
              <h3 className="font-alsun-serif text-secondary text-xl font-semibold tracking-tighter md:text-2xl">
                {module.title}
              </h3>
            </div>
          </div>
          <div className="border-t border-slate-200/80 bg-linear-to-b from-white to-slate-50 p-6 md:p-8">
            <p className="mb-8 max-w-3xl text-lg text-slate-700">{module.description}</p>

            <h4 className="mb-4 text-sm font-bold tracking-widest text-slate-500 uppercase">
              Available Formats
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {module.variants.map((variant) => (
                <VariantCard key={variant.variantId} variant={variant} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VariantCard({ variant }: { variant: ModuleVariant }) {
  return (
    <div className="group hover:border-primary/50 animate-subtle-shine relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <ModuleVariantTypeBadge type={variant.variantType} singleRow />
          <p className="text-secondary mt-2 text-3xl font-bold">
            {variant.price > 0 ? `EGP${variant.price}` : "Free"}
          </p>
        </div>
        <Link href={`/checkout?moduleId=${variant.moduleId}&type=${variant.variantType}`}>
          <div className="transition-all duration-300 group-hover:scale-105 hover:scale-110">
            <button className="from-secondary to-secondary group-hover:to-primary hover:from-primary rounded-lg bg-linear-to-r px-5 py-3 font-bold text-white transition-colors duration-300 group-hover:shadow-md">
              Enroll
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
