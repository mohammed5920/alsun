import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateCourse } from "../../src/lib/actions/course";
import { readPrivilegedUser } from "../../src/lib/data/user";

const mocks = vi.hoisted(() => {
  const txMethods = {
    course: { update: vi.fn() },
    module: { delete: vi.fn(), upsert: vi.fn() },
    moduleVariant: { deleteMany: vi.fn(), createMany: vi.fn() },
  };

  return {
    prisma: {
      course: { findFirst: vi.fn() },
      $transaction: vi.fn(async (callback) => {
        return callback(txMethods);
      }),
      tx: txMethods,
    },
  };
});

vi.mock("../../src/lib/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("../../src/lib/data/user", () => ({ readPrivilegedUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("server-only", () => ({}));

describe("Server Action: updateCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should BLOCK hiding a course (isPublic: false) if students are enrolled", async () => {
    (readPrivilegedUser as any).mockResolvedValue({ id: "admin", roleLevel: 3 });
    mocks.prisma.course.findFirst.mockResolvedValue({
      courseId: "c1",
      title: "Old Title",
      isPublic: true,
      modules: [
        {
          moduleId: "m1",
          enrollments: [{ enrollmentId: "e1" }],
        },
      ],
    });

    const result = await updateCourse({
      courseId: "c1",
      title: "New Title",
      description: "Desc",
      thumbnailUrl: "http://img.com",
      isPublic: false,
      tags: [{ name: "tag", type: "Category" }],
      modules: [
        {
          moduleId: "m1",
          index: 0,
          title: "M1",
          description: "D",
          teacherIds: [],
          variants: [{ variantType: "GROUP_ONLINE", price: 1 }],
        },
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Can't hide a course with enrolled students!");
    expect(mocks.prisma.tx.course.update).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should successfully update metadata, delete unused modules, and upsert new ones", async () => {
    (readPrivilegedUser as any).mockResolvedValue({ id: "admin", roleLevel: 3 });
    mocks.prisma.course.findFirst.mockResolvedValue({
      courseId: "c1",
      isPublic: true,
      modules: [{ moduleId: "module-A", enrollments: [] }],
    });

    mocks.prisma.tx.module.upsert.mockResolvedValue({ moduleId: "module-B" });
    const result = await updateCourse({
      courseId: "c1",
      title: "New Title",
      description: "Desc",
      thumbnailUrl: "http://img.com",
      isPublic: true,
      tags: [{ name: "tag", type: "Category" }],
      modules: [
        {
          moduleId: "module-B", // New module
          index: 0,
          title: "New Module",
          description: "Desc",
          teacherIds: ["t1"],
          variants: [{ variantType: "PRIVATE_ONLINE", price: 10 }],
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(mocks.prisma.tx.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { courseId: "c1" },
        data: expect.objectContaining({ title: "New Title" }),
      })
    );

    expect(mocks.prisma.tx.module.delete).toHaveBeenCalledWith({
      where: { moduleId: "module-A" },
    });

    expect(mocks.prisma.tx.module.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { moduleId: "module-B" },
      })
    );

    expect(mocks.prisma.tx.moduleVariant.createMany).toHaveBeenCalled();
    expect(revalidatePath).toBeCalledTimes(3);
  });
});
