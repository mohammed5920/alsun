import { Course, CourseTag, ModuleVariantType } from "@/generated/prisma/browser";
import { z } from "zod";
import { TagSchema } from "./tags";

export type TaggedCourse = Course & {
  tags: CourseTag[];
};

const priceSchema = z
  .number()
  .int()
  .nonnegative()
  .lte(1000000, { error: "Cannot enter a price over a million pounds" });

export const CourseModuleVariantSchema = z.object({
  variantType: z.enum(ModuleVariantType).nonoptional({ error: "[BUG] All variants need a type" }),
  price: priceSchema,
});

export const CourseUpdateModuleSchema = z.object({
  moduleId: z.string().nonempty(),
  index: z.number().nonnegative(),
  title: z.string().nonempty({ error: "All modules need to have a title." }),
  description: z.string().nonempty({ error: "All modules need a description." }),
  teacherIds: z.array(z.string().nonempty()),
  variants: z
    .array(CourseModuleVariantSchema)
    .nonempty({ error: "All modules need at least one variant enabled" })
    .refine(
      (vs) => {
        const seen = new Set();
        for (const v of vs) {
          if (seen.has(v.variantType)) return false;
          seen.add(v.variantType);
        }
        return true;
      },
      { error: "[BUG] Variants must have unique types" }
    ),
});

export const CourseUpdateSchema = z.object({
  courseId: z.string().nonempty(),
  title: z.string().nonempty({ error: "Course needs to have a title" }),
  description: z.string().nonempty({ error: "Course needs to have a description" }),
  thumbnailUrl: z.url({ error: "Empty thumbnail" }).nonempty({ error: "Empty thumbnail" }),

  isPublic: z.boolean(),
  modules: z
    .array(CourseUpdateModuleSchema)
    .nonempty({ error: "Course needs to have at least 1 module" })
    .refine((modules) => [...new Set(modules.map((mod) => mod.index))].length === modules.length, {
      error: "[BUG] Module indices must be unique",
    }),
  tags: z.array(TagSchema).nonempty("Courses need to be described with at least 1 tag"),
});
