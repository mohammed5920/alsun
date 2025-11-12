"use server";

import { prisma } from "@/lib/prisma";
import { readUser } from "../data/user";
import { Result } from "../types/util";

export async function sendError(error: string): Promise<Result<true>> {
  const user = await readUser();
  if (typeof error !== "string") return { ok: false, error: "Cannot parse error." };
  await prisma.error.create({
    data: { message: error, userId: user?.id || null },
  });
  return { ok: true, data: true };
}
