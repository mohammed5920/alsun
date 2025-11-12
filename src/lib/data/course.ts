import { Course, Prisma } from "@prisma/client";
import "server-only";
import z from "zod";
import { CourseUpdateSchema } from "../types/course";
import { Result, Strip } from "../types/util";

//change tile, description, thumbnail, visbility, tags
export async function updateCourseMetadata(
  tx: Prisma.TransactionClient,
  newCourse: z.infer<typeof CourseUpdateSchema>,
  oldCourse: Course & {
    modules: { enrollments: { enrollmentId: string }[] }[];
  }
): Promise<Result<true>> {
  if (!newCourse.isPublic && oldCourse.modules.some((module) => module.enrollments.length > 0))
    return { ok: false, error: "Can't hide a course with enrolled students!" };

  await tx.course.update({
    where: { courseId: oldCourse.courseId },
    data: {
      title: newCourse.title,
      description: newCourse.description,
      thumbnailUrl: newCourse.thumbnailUrl,
      isPublic: newCourse.isPublic,
      tags: {
        set: newCourse.tags.map((tag) => ({ name: tag.name })),
      },
    },
  });
  return { ok: true, data: true };
}

//diff modules
export async function deleteExtraModules(
  tx: Prisma.TransactionClient,
  newCourse: z.infer<typeof CourseUpdateSchema>,
  oldCourse: Strip<Course> & {
    modules: { moduleId: string; enrollments: { enrollmentId: string }[] }[];
  }
): Promise<Result<true>> {
  const modulesToDelete = oldCourse.modules.filter(
    (oldModule) => !newCourse.modules.some((newModule) => newModule.moduleId === oldModule.moduleId)
  );
  for (const deletedModule of modulesToDelete) {
    if (
      oldCourse.modules.find((eModule) => eModule.moduleId === deletedModule.moduleId)!.enrollments
        .length > 0
    ) {
      return {
        ok: false,
        error: "Cannot delete a module with enrolled students!",
      };
    }
  }
  for (const m of modulesToDelete) {
    await tx.module.delete({ where: { moduleId: m.moduleId } });
  }
  return { ok: true, data: true };
}

//change the data of modules
export async function upsertCourseModules(
  tx: Prisma.TransactionClient,
  newCourse: z.infer<typeof CourseUpdateSchema>
): Promise<Result<true>> {
  for (const m of newCourse.modules) {
    const { teacherIds, variants, moduleId, ...metadata } = m;
    const teacherIdSet = new Set(teacherIds);

    const freshModule = await tx.module.upsert({
      where: { moduleId: moduleId },
      update: {
        ...metadata,
        teachers: { set: [...teacherIdSet].map((id) => ({ id })) },
      },
      create: {
        ...metadata,
        courseId: newCourse.courseId,
        teachers: { connect: [...teacherIdSet].map((id) => ({ id })) },
      },
    });
    await tx.moduleVariant.deleteMany({ where: { moduleId: freshModule.moduleId } });
    await tx.moduleVariant.createMany({
      data: variants.map((v) => ({ ...v, moduleId: freshModule.moduleId })),
    });
  }

  return { ok: true, data: true };
}
