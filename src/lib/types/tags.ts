import { CourseTag, CourseTagType } from "@/generated/prisma/browser";
import z from "zod";

export function toggleTag<T extends { name: string }>(arr: T[], value: T): T[] {
  const exists = arr.some((v) => v.name === value.name);
  return exists ? arr.filter((v) => v.name !== value.name) : [...arr, value];
}

export function groupTags(tags: CourseTag[]) {
  return tags.reduce(
    (acc, tag) => {
      const { type } = tag;
      if (!acc[type]) {
        acc[type] = [];
      }
      if (!acc[type].find((existingTag) => existingTag.name === tag.name)) {
        acc[type].push(tag);
      }
      return acc;
    },
    {} as Record<CourseTagType, CourseTag[]>
  );
}

export const TagSchema = z.object({
  name: z.string({ error: "Tag needs a name" }).nonempty({ error: "Tag needs a name" }),
  type: z.enum(CourseTagType, {
    error: "Tag needs to belong to a predefined type",
  }),
});
