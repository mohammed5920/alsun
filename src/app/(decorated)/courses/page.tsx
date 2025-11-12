import { prisma } from "@/lib/prisma";
import { TaggedCourse } from "@/lib/types/course";
import Home from "./client";

export default async function BrowserWrapper() {
  const courses = await prisma.course.findMany({
    where: { isPublic: true },
    include: {
      tags: { orderBy: { name: "asc" } },
    },
  });
  return <Home summaries={courses as TaggedCourse[]} />;
}
