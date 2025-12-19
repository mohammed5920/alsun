import { ModuleVariantType } from "@/generated/prisma/browser";
import z from "zod";

export const EnrollUserSchema = z.object({
  moduleId: z.string().nonempty(),
  variantType: z.enum(ModuleVariantType).nonoptional(),
});

export const UpdateUserSchema = z.object({
  email: z.email({ error: "Email is required" }).trim(),
  image: z.url().nullable(),
  name: z.string().nonempty({ error: "Please add a name." }),
  bio: z.string().nullable(),
});

export const UpdateUserPasswordSchema = z
  .object({
    oldPass: z.string().nonempty({ error: "Old password is required" }),
    newPass: z
      .string({ error: "New password is required" })
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmPass: z.string({ error: "Password confirmation is required" }),
  })
  .refine((data) => data.newPass === data.confirmPass, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserRoleSchema = z.object({
  userId: z.string().nonempty(),
  roleLevel: z.int().gt(0).lt(5),
});
