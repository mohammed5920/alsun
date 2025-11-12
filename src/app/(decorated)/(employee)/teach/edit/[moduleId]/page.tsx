import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ModuleEditor from "./client";

export default async function EditorWrapper({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const user = await readUser();
  if (!user) redirect(`/login?redirect=/teach/edit/${moduleId}`);
  if (user.roleLevel < 2) redirect("/");

  const mod = await prisma.module.findFirst({
    where: {
      moduleId: moduleId,
      teachers: user.roleLevel >= 3 ? undefined : { some: { id: user.id } },
    },
    include: {
      course: { include: { tags: true } },
      contents: true,
      variants: true,
      teachers: { select: { id: true } },
    },
  });
  if (!mod) redirect("/teach");
  return <ModuleEditor initialModule={mod} />;
}
