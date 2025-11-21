import { ModuleVariantType } from "@prisma/client";
import { describe, expect, it } from "vitest";
import z from "zod";
import {
  CourseModuleVariantSchema,
  CourseUpdateModuleSchema,
  CourseUpdateSchema,
} from "../../src/lib/types/course";

describe("Course Logic Validation", () => {
  it("should reject a module with duplicate variant types", () => {
    const badModule: z.infer<typeof CourseUpdateModuleSchema> = {
      moduleId: "123",
      index: 0,
      title: "Test",
      description: "Desc",
      teacherIds: [],
      variants: [
        { variantType: "PRIVATE_ONLINE", price: 100 },
        { variantType: "PRIVATE_ONLINE", price: 200 },
      ],
    };

    const result = CourseUpdateModuleSchema.safeParse(badModule);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("unique types");
    }
  });

  it("should reject a course with duplicate module indices", () => {
    const badCourse: z.infer<typeof CourseUpdateSchema> = {
      courseId: "test",
      title: "test",
      description: "test",
      thumbnailUrl: "https://test.com",
      isPublic: true,
      tags: [{ name: "hello", type: "Category" }],
      modules: [
        {
          moduleId: "123",
          index: 0,
          title: "Test",
          description: "Desc",
          teacherIds: [],
          variants: [{ variantType: "PRIVATE_ONLINE", price: 100 }],
        },
        {
          moduleId: "123",
          index: 0,
          title: "Test",
          description: "Desc",
          teacherIds: [],
          variants: [{ variantType: "PRIVATE_ONLINE", price: 100 }],
        },
      ],
    };

    const result = CourseUpdateSchema.safeParse(badCourse);
    expect(result.success).toBe(false);
  });

  it("should reject a variant without a valid type", () => {
    const badVariant: z.infer<typeof CourseModuleVariantSchema> = {
      price: 1,
      variantType: "banana" as unknown as ModuleVariantType,
    };
    expect(CourseModuleVariantSchema.safeParse(badVariant).success).toBe(false);
  });
});
