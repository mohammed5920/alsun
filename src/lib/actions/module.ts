"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { readPrivilegedUser } from "../data/user";
import { ModuleUpdateSchema, removeTeacherSchema } from "../types/module";
import { Result } from "../types/util";

export async function updateModule(
  newModule: z.infer<typeof ModuleUpdateSchema>
): Promise<Result<true>> {
  //authorise the user
  const user = await readPrivilegedUser(2);
  if (!user) return { ok: false, error: "Not authorised!" };

  //parse the payload
  const parsed = ModuleUpdateSchema.safeParse(newModule);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  //verify existing module
  const existingModule = await prisma.module.findFirst({
    where: { moduleId: parsed.data.moduleId },
    include: {
      teachers: { select: { id: true } },
    },
  });
  if (!existingModule) return { ok: false, error: "Can't find existing module!" };
  if (user.roleLevel < 3 && !existingModule.teachers.some((teacher) => teacher.id === user.id))
    return { ok: false, error: "Not authorised!" };

  await prisma.$transaction(async (tx) => {
    await tx.module.update({
      where: { moduleId: parsed.data.moduleId },
      data: {
        description: parsed.data.description,
      },
    });
    await tx.moduleContent.deleteMany({
      where: { moduleId: parsed.data.moduleId },
    });
    if (parsed.data.contents)
      await tx.moduleContent.createMany({
        data: parsed.data.contents.map((content) => ({
          ...content,
          moduleId: parsed.data.moduleId,
        })),
      });
  });
  revalidatePath(`/courses/${existingModule.courseId}`);
  return { ok: true, data: true };
}

export async function removeTeacherFromModule(
  data: z.infer<typeof removeTeacherSchema>
): Promise<Result<true>> {
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  const parsed = removeTeacherSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Bad data shape" };
  const existingModule = await prisma.module.findFirst({
    where: { moduleId: parsed.data.moduleId, teachers: { some: { id: parsed.data.teacherId } } },
  });
  if (!existingModule) return { ok: false, error: "No module found with this teacher" };
  await prisma.module.update({
    where: { moduleId: parsed.data.moduleId },
    data: { teachers: { disconnect: { id: parsed.data.teacherId } } },
  });
  return { ok: true, data: true };
}
