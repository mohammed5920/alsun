"use server";
import { prisma } from "@/lib/prisma";
import { CourseTag } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";
import { readPrivilegedUser } from "../data/user";
import { TagSchema } from "../types/tags";
import { Result } from "../types/util";

/**
 *
 * @returns the created tag object
 */
export async function createTag(tag: z.infer<typeof TagSchema>): Promise<Result<CourseTag>> {
  const user = readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  const parsed = TagSchema.safeParse(tag);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (await prisma.courseTag.count({ where: { name: parsed.data.name } }))
    return { ok: false, error: "Tag with this name already exists" };
  const res = await prisma.courseTag.create({ data: parsed.data });
  return { ok: true, data: res };
}

export async function deleteTag(tagId: string): Promise<Result<true>> {
  if (typeof tagId !== "string" || !tagId) return { ok: false, error: "Bad tag ID" };
  const user = readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  const coursesToRevalidate = await prisma.course
    .findMany({ where: { tags: { some: { tagId: tagId } } }, select: { courseId: true } })
    .then((courses) => courses.map((c) => c.courseId));
  await prisma.courseTag.deleteMany({ where: { tagId: tagId } });
  revalidatePath("/");
  revalidatePath("/courses");
  coursesToRevalidate.forEach((cId) => revalidatePath(`/courses/${cId}`));
  return { ok: true, data: true };
}
