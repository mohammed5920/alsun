import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSettings from "./client";

export default async function ProfileWrapper() {
  const user = await readUser();
  if (!user) redirect("/login?redirect=/settings/profile");
  const userFromPrisma = await prisma.user.findFirstOrThrow({ where: { id: user.id } });
  return <ProfileSettings initialUser={userFromPrisma} />;
}
