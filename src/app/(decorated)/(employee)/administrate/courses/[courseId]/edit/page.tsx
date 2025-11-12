import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CourseEditorPage from "./client";

export default async function EditorWrapper({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await readUser();
  if (!user) redirect(`/login?redirect=/administrate/courses/${courseId}/edit`);
  if (user.roleLevel < 3) redirect("/");

  const [course, tags, teachers] = await Promise.all([
    prisma.course.findFirst({
      where: { courseId: courseId },
      include: {
        modules: {
          include: {
            teachers: { select: { id: true } },
            variants: true,
            enrollments: { select: { enrollmentId: true } },
          },
          orderBy: { index: "asc" },
        },
        tags: true,
      },
    }),
    prisma.courseTag.findMany(),
    prisma.user.findMany({
      where: { roleLevel: 2 },
      select: { id: true, image: true, name: true },
    }),
  ]);

  if (!course) redirect("/administrate");
  const initialCourse = {
    ...course,
    modules: course.modules.map((m) => {
      const { teachers, ...rest } = m;
      return { ...rest, teacherIds: teachers.map((t) => t.id) };
    }),
  };
  return <CourseEditorPage allTags={tags} allTeachers={teachers} initialCourse={initialCourse} />;
}
