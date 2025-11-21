import RecentActivity from "@/components/alsun/staff/recentActivity";
import { StaffCourseCard } from "@/components/alsun/staff/staffCourseCard";
import Stats from "@/components/alsun/staff/statCard";
import { WithActionOnClick } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { createCourse, deleteCourse } from "@/lib/actions/course";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { Edit, EditIcon, PlusCircle, Trash, UserIcon, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const admin = await readUser();
  if (!admin) redirect("/login?redirect=/administrate");
  if (admin.roleLevel < 3) redirect("/");

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          enrollments: {
            include: { student: true },
            orderBy: { enrolledAt: "desc" },
          },
        },
      },
      tags: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  const WeekAgo = new Date();
  WeekAgo.setDate(WeekAgo.getDate() - 7);

  const recent = [
    ...courses.flatMap((course) =>
      course.modules.flatMap((module) =>
        module.enrollments.map((e) => ({
          icon: UserIcon,
          text: `${e.student.name} enrolled in ${course.title}`,
          date: e.enrolledAt,
        }))
      )
    ),
    ...courses.map((c) => ({
      icon: EditIcon,
      text: `${c.title || "Untitled course"} was updated`,
      date: c.updatedAt,
    })),
    ...courses.map((c) => ({
      icon: PlusCircle,
      text: `${c.title || "Untitled course"} was created`,
      date: c.createdAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="animate-in fade-in mt-20 transform-gpu py-4 duration-500">
      <div className="mx-auto w-7xl max-w-[85vw]">
        <div className="mb-8">
          <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            Welcome back, {admin.name}! 👋
          </h1>
          <p className="mt-2 text-lg text-slate-500">Manage your content.</p>
        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex grow flex-col">
            <div className="mx-auto mb-4 flex w-full items-center justify-between">
              <h2 className="font-alsun-serif text-secondary text-2xl font-bold">Courses</h2>
              <WithActionOnClick
                action={createCourse}
                onSuccess={async (courseId) => {
                  "use server";
                  redirect(`/administrate/courses/${courseId}/edit`);
                }}
              >
                <Button variant="secondary" className="text-white">
                  <PlusCircle className="h-4 w-4" />
                  Create New Course
                </Button>
              </WithActionOnClick>
            </div>
            <div className="flex gap-2 flex-wrap">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="hover:shadow-md hover:-translate-y-1 transition flex-1 rounded-2xl"
                >
                  <StaffCourseCard
                    course={course}
                    link={`/administrate/courses/${course.courseId}`}
                    moduleCount={course.modules.length}
                    studentCount={course.modules.reduce((a, b) => a + b.enrollments.length, 0)}
                  >
                    <div className="flex items-center justify-center py-2 gap-1">
                      <Link href={`/administrate/courses/${course.courseId}`}>
                        <button className="border-secondary/20 hover:bg-primary hover:border-primary rounded-md border p-1.5 transition-all hover:text-white cursor-pointer">
                          <Users strokeWidth={2} className="size-4" />
                        </button>
                      </Link>
                      <Link href={`/administrate/courses/${course.courseId}/edit`}>
                        <button className="border-secondary/20 hover:bg-primary hover:border-primary rounded-md border p-1.5 transition-all hover:text-white cursor-pointer">
                          <Edit strokeWidth={2} className="size-4" />
                        </button>
                      </Link>

                      <WithActionOnClick
                        confirmationOptions={{
                          title: "Delete Course",
                          description: `Are you sure you want to delete ${course.title || "this untitled course"}? This action cannot be undone.`,
                        }}
                        action={async () => {
                          "use server";
                          return deleteCourse(course.courseId);
                        }}
                      >
                        <button
                          className={`p-1.5 border-secondary/20 rounded-md border cursor-pointer transition-all hover:border-red-600 hover:bg-red-600 hover:text-white`}
                        >
                          <Trash strokeWidth={2} className="size-4" />
                        </button>
                      </WithActionOnClick>
                    </div>
                  </StaffCourseCard>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-xs flex-col gap-4">
            <Link href={"/administrate/users"}>
              <Button variant={"secondary"} className="text-slate-100 w-full">
                <Users />
                View All Users
              </Button>
            </Link>
            <Stats modules={courses.flatMap((course) => course.modules)} />
            <RecentActivity recent={recent} />
          </div>
        </div>
      </div>
    </div>
  );
}
