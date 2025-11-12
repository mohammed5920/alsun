import { ModuleContentType, ModuleVariantType } from "@prisma/client";
import z from "zod";

export const ModuleContentSchema = z.object({
  contentType: z.enum(ModuleContentType).nonoptional({ error: "Content must have a type" }),
  title: z.string().nonempty({ error: "Content must have a title" }),
  url: z
    .url({
      error:
        "Invalid material - check all files are uploaded and all links start with http:// or https://",
    })
    .nonempty({ error: "Content must have linked material" }),
  viewableBy: z
    .array(z.enum(ModuleVariantType))
    .nonempty({ error: "Content must be viewable by one type of enrolled student" })
    .transform((arr) => [...new Set(arr)]),
});

export const ModuleUpdateSchema = z.object({
  moduleId: z.string().nonempty(),
  description: z.string().nonempty({ error: "All modules need a description." }),
  contents: z.array(ModuleContentSchema),
});

export const removeTeacherSchema = z.object({
  teacherId: z.string().nonempty(),
  moduleId: z.string().nonempty(),
});
