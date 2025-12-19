import { CourseTagBadge } from "@/components/alsun/marketing/courseTagBadge";
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { DarkSection } from "@/components/alsun/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Enrollment, Module } from "@/generated/prisma/browser";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { TaggedCourse } from "@/lib/types/course";
import { getInitials } from "@/lib/utils";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type CourseWithEnrollments = TaggedCourse & {
  enrollments: (Enrollment & { module: Module })[];
};

export default async function StudentDashboardPage() {
  const user = await readUser();
  if (!user) redirect("/login?redirect=/learn");

  const student = await prisma.user.findFirstOrThrow({
    where: { id: user.id },
    include: {
      enrollments: {
        include: {
          module: { include: { course: { include: { tags: true } } } },
        },
      },
    },
  });

  const courses = student.enrollments.reduce(
    (acc, enrollment) => {
      const course = enrollment.module.course;
      if (!acc[course.courseId]) {
        acc[course.courseId] = { ...course, enrollments: [] };
      }
      acc[course.courseId].enrollments.push(enrollment);
      return acc;
    },
    {} as Record<string, CourseWithEnrollments>
  );

  return (
    <div className="animate-in fade-in flex h-full w-full transform-gpu flex-col duration-500">
      <DarkSection>
        <header className="bg-secondary relative w-full overflow-hidden pt-20 pb-6">
          <div className="absolute inset-0 z-10 size-full bg-white/30 mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2dCMVhXIQiv4Ho2zOKhY7LtSCkgBanMNcl6AF)] opacity-30" />
          <div className="relative z-20 flex h-full flex-col items-center justify-center p-4 text-center text-white">
            <Avatar className="mb-4 size-24 border border-white/10 bg-white/10 backdrop-blur-xs">
              <AvatarImage src={student.image || undefined} alt={student.name} />
              <AvatarFallback className="bg-transparent text-6xl text-white">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-alsun-serif text-4xl font-bold tracking-tighter text-shadow-md md:text-5xl">
              Welcome back, {student.name?.split(" ")[0]}.
            </h1>
          </div>
        </header>
      </DarkSection>

      <main className="container mx-auto p-4 md:p-8">
        {Object.values(courses).length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl bg-white/40 p-8 text-center shadow-md backdrop-blur-xs">
            <div className="mb-6 flex justify-center">
              <div className="from-primary/20 rounded-full bg-linear-to-br to-teal-400/20 p-5">
                <Compass className="size-24 text-teal-600" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="font-alsun-serif text-secondary text-4xl font-bold">
              Begin Your Learning Adventure
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-lg text-slate-500">
              Explore our catalog and unlock your potential today.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="group bg-primary px-8 py-6 text-lg hover:bg-teal-700"
              >
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          Object.values(courses).map((course) => (
            <CourseSection key={course.courseId} course={course} />
          ))
        )}
      </main>
    </div>
  );
}

function CourseSection({ course }: { course: CourseWithEnrollments }) {
  return (
    <section className="p-4 backdrop-blur-xs rounded-2xl shadow-md bg-white/10 border border-white/60">
      <div className="mb-6">
        <h2 className="font-alsun-serif from-primary bg-linear-to-r to-teal-400 bg-clip-text text-4xl font-semibold text-transparent">
          {course.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <CourseTagBadge key={tag.tagId} tag={tag} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {course.enrollments
          .sort((a, b) => a.module.index - b.module.index)
          .map((enrollment) => (
            <ModuleCard key={enrollment.enrollmentId} enrollment={enrollment} />
          ))}
      </div>
    </section>
  );
}

function ModuleCard({ enrollment }: { enrollment: CourseWithEnrollments["enrollments"][number] }) {
  const { module, variantType } = enrollment;

  return (
    <Link href={`/learn/${module.moduleId}`} className="group block">
      <div className="hover:border-primary p-6 space-y-4 flex h-full flex-col rounded-2xl border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex justify-between items-center flex-wrap">
          <h3 className="text-secondary text-xl leading-snug font-bold">{module.title}</h3>
          <div className="text-sm text-slate-500">
            <ModuleVariantTypeBadge type={variantType} singleRow />
          </div>
        </div>
        <span className="block px-2">{module.description}</span>
        <div className="text-primary flex items-center justify-end w-full gap-2 font-semibold">
          View Contents
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
