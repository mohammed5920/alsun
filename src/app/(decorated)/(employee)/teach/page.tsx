import RecentActivity from "@/components/alsun/staff/recentActivity";
import { StaffCourseCard } from "@/components/alsun/staff/staffCourseCard";
import Stats from "@/components/alsun/staff/statCard";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { EditIcon, PlusCircle, UserIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function teacherDashboard() {
  const teacher = await readUser();
  if (!teacher) redirect("/login?redirect=/teach");
  if (teacher.roleLevel < 2) redirect("/");

  const courses = await prisma.course.findMany({
    where: {
      modules: {
        some: { teachers: teacher.roleLevel >= 3 ? undefined : { some: { id: teacher.id } } },
      },
    },
    include: {
      modules: {
        where: {
          teachers: teacher.roleLevel >= 3 ? undefined : { some: { id: teacher.id } },
        },
        include: {
          enrollments: { include: { student: true }, orderBy: { enrolledAt: "desc" } },
          course: true,
        },
        orderBy: { index: "asc" },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  const modules = courses.flatMap((course) => course.modules);

  const WeekAgo = new Date();
  WeekAgo.setDate(WeekAgo.getDate() - 7);

  const recent = [
    ...modules.flatMap((module) =>
      module.enrollments.map((e) => ({
        icon: UserIcon,
        text: `${e.student.name} enrolled in ${module.title}`,
        date: e.enrolledAt,
      }))
    ),
    ...modules.map((m) => ({
      icon: EditIcon,
      text: `${m.title || "Untitled course"} was updated`,
      date: m.updatedAt,
    })),
    ...modules.map((m) => ({
      icon: PlusCircle,
      text: `${m.title || "Untitled course"} was created`,
      date: m.createdAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="animate-in fade-in mt-20 transform-gpu py-4 duration-500">
      <div className="mx-auto w-7xl max-w-[85vw]">
        <div className="mb-8">
          <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            Welcome back, {teacher.name}! 👋
          </h1>
          <p className="mt-2 text-lg text-slate-500">Manage your content.</p>
        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex grow flex-col">
            <div className="mx-auto mb-4 flex w-full items-center justify-between">
              <h2 className="font-alsun-serif text-secondary text-2xl font-bold">Modules</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {courses.map((course) => (
                <div key={course.courseId} className="flex-1">
                  <StaffCourseCard
                    course={course}
                    link=""
                    moduleCount={course.modules.length}
                    studentCount={course.modules.reduce((a, b) => a + b.enrollments.length, 0)}
                  >
                    <div className="p-1 flex flex-wrap gap-1">
                      {course.modules.map((mod) => (
                        <Link
                          key={mod.moduleId}
                          href={`/teach/edit/${mod.moduleId}`}
                          className="p-1 flex-1 rounded-md bg-secondary/5 text-center text-secondary/70 hover:scale-102 hover:shadow-lg transition hover:text-white hover:bg-primary"
                        >
                          {mod.title}
                        </Link>
                      ))}
                    </div>
                  </StaffCourseCard>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-xs flex-col gap-4">
            <Stats modules={modules} />
            <RecentActivity recent={recent} />
          </div>
        </div>
      </div>
    </div>
  );
}
