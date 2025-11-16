"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { env } from "process";
import z from "zod";
import { auth } from "../auth";
import { readPrivilegedUser, readUser } from "../data/user";
import {
  EnrollUserSchema,
  UpdateUserPasswordSchema,
  UpdateUserRoleSchema,
  UpdateUserSchema,
} from "../types/user";
import { Result } from "../types/util";

export async function enrollUser(data: z.infer<typeof EnrollUserSchema>): Promise<Result<true>> {
  const user = await readUser();
  if (!user) return { ok: false, error: "Unauthorised!" };

  const mod = await prisma.module.findFirst({
    where: { moduleId: data.moduleId, variants: { some: { variantType: data.variantType } } },
    include: {
      course: {
        select: { title: true, courseId: true },
      },
      enrollments: {
        where: { student: { id: user.id } },
        select: { enrollmentId: true },
      },
      variants: {
        where: { variantType: data.variantType },
      },
    },
  });
  if (!mod) return { ok: false, error: "Module/type not found" };
  if (mod.enrollments.length > 0) return { ok: false, error: "Already enrolled" };

  //enroll for free for the demo until paytabs verifies the website

  await prisma.enrollment.create({
    data: {
      pricePaid: mod.variants[0].price,
      variantType: mod.variants[0].variantType,
      studentId: user.id,
      moduleId: data.moduleId,
    },
  });

  return { ok: true, data: true };
}

export async function updateUser(data: z.infer<typeof UpdateUserSchema>): Promise<Result<true>> {
  const staleUser = await readUser();
  if (!staleUser) return { ok: false, error: "Not logged in" };
  const parsed = UpdateUserSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const check = await prisma.user.findFirst({ where: { email: data.email } });
  if (check && check.id !== staleUser.id) return { ok: false, error: "Email is taken." };

  await prisma.user.update({ where: { id: staleUser.id }, data: { ...data } });
  return { ok: true, data: true };
}

export async function updateUserPassword(
  data: z.infer<typeof UpdateUserPasswordSchema>
): Promise<Result<true>> {
  const staleUser = await readUser();
  if (!staleUser) return { ok: false, error: "Not logged in" };
  const parsed = UpdateUserPasswordSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await auth.api.changePassword({
      body: {
        newPassword: data.newPass,
        currentPassword: data.oldPass,
      },
      headers: await headers(),
    });
  } catch (e) {
    return { ok: false, error: (e as { message: string }).message };
  }
  return { ok: true, data: true };
}

export async function updateUserRole(
  data: z.infer<typeof UpdateUserRoleSchema>
): Promise<Result<true>> {
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  const parsed = UpdateUserRoleSchema.safeParse(data);

  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (parsed.data.userId === user.id)
    return { ok: false, error: "Cannot set your own role using this method." };
  if (parsed.data.roleLevel >= user.roleLevel)
    return { ok: false, error: "Cannot set someone to greater than or equal to your role level." };

  const targetUser = await prisma.user.findFirst({ where: { id: parsed.data.userId } });
  if (!targetUser) return { ok: false, error: "Target user not found." };
  if (targetUser.roleLevel >= user.roleLevel)
    return { ok: false, error: "Cannot update role of someone at the same or higher level." };

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { roleLevel: parsed.data.roleLevel },
  });
  return { ok: true, data: true };
}

export async function deleteUserEnrollment(enrollmentId: string): Promise<Result<true>> {
  if (typeof enrollmentId !== "string" || !enrollmentId)
    return { ok: false, error: "Invalid ID type" };
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  await prisma.enrollment.deleteMany({ where: { enrollmentId } });
  return { ok: true, data: true };
}

export async function deleteUser(targetUserId: string): Promise<Result<true>> {
  if (typeof targetUserId !== "string" || !targetUserId)
    return { ok: false, error: "Invalid ID type" };
  const user = await readPrivilegedUser(3);
  if (!user) return { ok: false, error: "Not authorised" };
  if (user.id === targetUserId)
    return { ok: false, error: "Do not use this method to delete your own account" };
  const target = await prisma.user.findFirst({ where: { id: targetUserId } });
  if (!target) return { ok: false, error: "User not found" };
  if (target.roleLevel >= user.roleLevel) return { ok: false, error: "Not authorised" };
  await prisma.user.delete({ where: { id: targetUserId } });
  return { ok: true, data: true };
}

export async function deleteSelf(): Promise<Result<true>> {
  const user = await readUser();
  if (!user) return { ok: false, error: "Not logged in" };
  await auth.api.revokeSessions({ headers: await headers() });
  await prisma.user.delete({ where: { id: user.id } });
  return { ok: true, data: true };
}

export async function grantOwner(password: string): Promise<Result<true>> {
  if (typeof password !== "string" || !password || password !== env.MASTER_PASSWORD)
    return { ok: false, error: "Bad master password" };
  const user = await readUser();
  if (!user) return { ok: false, error: "Not logged in" };
  const [existingUser, existingOwner] = await Promise.all([
    prisma.user.count({ where: { id: user.id } }),
    prisma.user.count({ where: { roleLevel: 4 } }),
  ]);
  if (!existingUser) return { ok: false, error: "User doesn't exist in database" };
  if (existingOwner) return { ok: false, error: "Owner already exists" };
  await prisma.user.update({ where: { id: user.id }, data: { roleLevel: 4 } });
  return { ok: true, data: true };
}
