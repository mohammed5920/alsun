import { CourseHero } from "@/components/alsun/marketing/courseHero";
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { WithActionOnClick } from "@/components/alsun/withAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCourse } from "@/lib/actions/course";
import { removeTeacherFromModule } from "@/lib/actions/module";
import { deleteUserEnrollment } from "@/lib/actions/user";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import { BookOpen, DollarSign, Edit, Trash, Users, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminCourseDashboard({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await readUser();

  if (!user) redirect(`/login?redirect=/administrate/courses/${courseId}`);
  if (user.roleLevel < 3) redirect("/");

  const course = await prisma.course.findFirst({
    where: {
      courseId: courseId,
    },
    include: {
      tags: true,
      modules: {
        orderBy: { index: "asc" },
        include: {
          enrollments: {
            orderBy: { enrolledAt: "desc" },
            include: { student: true },
          },
          teachers: true,
        },
      },
    },
  });

  if (!course) redirect("/administrate");

  const courseTotalRevenue = course.modules.reduce(
    (courseSum, mod) =>
      courseSum + mod.enrollments.reduce((modSum, enr) => modSum + enr.pricePaid, 0),
    0
  );

  const courseTotalEnrollments = course.modules.reduce(
    (sum, mod) => sum + mod.enrollments.length,
    0
  );

  function ModuleTable({ module }: { module: NonNullable<typeof course>["modules"][number] }) {
    const moduleRevenue = module.enrollments.reduce((sum, enr) => sum + enr.pricePaid, 0);
    const moduleEnrollments = module.enrollments.length;

    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 items-end md:flex-row md:items-center md:justify-between">
            <Link href={`/teach/edit/${module.moduleId}`}>
              <div className="bg-slate-100 p-4 rounded-2xl hover:bg-slate-200 transition-all hover:scale-103 hover:shadow-md shadow-sm">
                <CardTitle className="font-alsun-serif font-light">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
            </Link>
            <div className="flex shrink-0 gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Revenue</p>
                <p className="font-semibold">EGP{moduleRevenue}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Enrollments
                </p>
                <p className="font-semibold">{moduleEnrollments}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4}>Teachers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.teachers.length > 0 ? (
                module.teachers.map((teacher) => {
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="hover:bg-slate-100 transition-colors" colSpan={4}>
                        <Link href={`/administrate/users/${teacher.id}`} className="cursor-pointer">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={teacher.image ?? undefined} alt={teacher.name} />
                              <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{teacher.name}</p>
                              <p className="hidden text-sm text-muted-foreground sm:block">
                                {teacher.email}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <WithActionOnClick
                          confirmationOptions={{
                            title: "Remove Teacher",
                            description: `Are you sure you want to remove ${teacher.name} as a teacher of ${module.title}? They can be added back later.`,
                          }}
                          action={async () => {
                            "use server";
                            return removeTeacherFromModule({
                              teacherId: teacher.id,
                              moduleId: module.moduleId,
                            });
                          }}
                        >
                          <button className="p-1.5 border-secondary/20 rounded-md border transition-all hover:border-red-600 hover:bg-red-600 hover:text-white">
                            <X strokeWidth={2} className="size-4" />
                          </button>
                        </WithActionOnClick>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-20">
                    No assigned teachers. Assign a teacher to allow them to add module material.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableHeader>
              <TableRow>
                <TableHead>Students</TableHead>
                <TableHead className="hidden md:table-cell">Variant</TableHead>
                <TableHead className="hidden lg:table-cell">Enrolled On</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.enrollments.length > 0 ? (
                module.enrollments.map((enrollment) => {
                  return (
                    <TableRow key={enrollment.enrollmentId}>
                      <TableCell className="hover:bg-slate-100 transition-colors">
                        <Link
                          href={`/administrate/users/${enrollment.studentId}`}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={enrollment.student.image ?? undefined}
                                alt={enrollment.student.name}
                              />
                              <AvatarFallback>
                                {getInitials(enrollment.student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{enrollment.student.name}</p>
                              <p className="hidden text-sm text-muted-foreground sm:block">
                                {enrollment.student.email}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="w-fit">
                          <ModuleVariantTypeBadge type={enrollment.variantType} singleRow />
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>EGP{enrollment.pricePaid}</TableCell>
                      <TableCell className="text-right">
                        <WithActionOnClick
                          confirmationOptions={{
                            title: "Delete Enrollment",
                            description: `Are you sure you want to delete ${enrollment.student.name}'s enrollment to ${module.title}? This will not refund them.`,
                          }}
                          action={async () => {
                            "use server";
                            return deleteUserEnrollment(enrollment.enrollmentId);
                          }}
                        >
                          <button className="p-1.5 border-secondary/20 rounded-md border transition-all hover:border-red-600 hover:bg-red-600 hover:text-white">
                            <Trash strokeWidth={2} className="size-4" />
                          </button>
                        </WithActionOnClick>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No enrollments for this module.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in transform-gpu duration-500 max-w-screen">
      <CourseHero course={course} />
      <div className="max-w-7xl px-4 md:px-16 mx-auto mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-alsun-serif">Total Course Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">EGP{courseTotalRevenue}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {course.modules.length} modules
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-alsun-serif">Total Course Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseTotalEnrollments}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Student{courseTotalEnrollments === 1 ? "" : "s"} across all modules
              </p>
            </CardContent>
          </Card>
          <div className="flex md:flex-col h-full w-full justify-center gap-4">
            <Link href={`/administrate/courses/${course.courseId}/edit`}>
              <button className="flex gap-2 items-center justify-center backdrop-blur-sm p-4 bg-primary/20 text-secondary/80 uppercase tracking-widest rounded-2xl size-full hover:scale-102 hover:shadow-sm transition-all cursor-pointer">
                <Edit />
                Edit
              </button>
            </Link>
            <div>
              <WithActionOnClick
                confirmationOptions={{
                  title: "Delete Course",
                  description: `Are you sure you want to delete ${course.title || "this untitled course"}? This action cannot be undone.`,
                }}
                action={async () => {
                  "use server";
                  return deleteCourse(course!.courseId);
                }}
              >
                <button className="flex gap-2 items-center justify-center backdrop-blur-sm p-4 bg-red-600/20 text-red-900/50 uppercase tracking-widest rounded-2xl size-full hover:scale-102 hover:shadow-sm transition-all cursor-pointer">
                  <Trash />
                  Delete
                </button>
              </WithActionOnClick>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 overflow-x-scroll md:overflow-x-auto">
          <h2 className="text-2xl font-semibold tracking-tight font-alsun-serif">
            Module Breakdown
          </h2>
          {course.modules.length > 0 ? (
            course.modules.map((module) => <ModuleTable key={module.moduleId} module={module} />)
          ) : (
            <Card className="flex h-48 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8" />
                <p className="mt-2">This course has no modules yet.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
