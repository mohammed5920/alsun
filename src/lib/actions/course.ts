"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { deleteExtraModules, updateCourseMetadata, upsertCourseModules } from "../data/course";
import { readPrivilegedUser } from "../data/user";
import { CourseUpdateSchema } from "../types/course";
import { Result } from "../types/util";

/**
 *
 * @returns course id
 */
export async function createCourse(): Promise<Result<string>> {
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised!" };
  const res = await prisma.course.create({
    data: {
      title: "",
      description: "",
      thumbnailUrl: "",
    },
  });
  return { ok: true, data: res.courseId };
}

export async function updateCourse(
  newCourse: z.infer<typeof CourseUpdateSchema>
): Promise<Result<true>> {
  //auth
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised!" };

  //parse and fetch existing
  const parsed = CourseUpdateSchema.safeParse(newCourse);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const existingCourse = await prisma.course.findFirst({
    where: { courseId: parsed.data.courseId },
    include: {
      modules: { include: { enrollments: { select: { enrollmentId: true } } } },
    },
  });
  if (!existingCourse) {
    return { ok: false, error: "Can't find existing course!" };
  }

  //update
  try {
    await prisma.$transaction(
      async (tx) => {
        const metadataResult = await updateCourseMetadata(tx, parsed.data, existingCourse);
        if (!metadataResult.ok) {
          throw new Error(metadataResult.error);
        }
        const deleteResult = await deleteExtraModules(tx, parsed.data, existingCourse);
        if (!deleteResult.ok) {
          throw new Error(deleteResult.error);
        }
        const upsertResult = await upsertCourseModules(tx, parsed.data);
        if (!upsertResult.ok) {
          throw new Error(upsertResult.error);
        }
      },
      { timeout: 10000 }
    );

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${parsed.data.courseId}`);
    return { ok: true, data: true };
  } catch (e) {
    console.error("Error updating course:", e);
    const errorMessage = e instanceof Error ? e.message : "Server error.";
    return { ok: false, error: errorMessage };
  }
}

export async function deleteCourse(courseId: string): Promise<Result<true>> {
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Unauthorised!" };
  await prisma.course.deleteMany({ where: { courseId: courseId } });
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  return { ok: true, data: true };
}
