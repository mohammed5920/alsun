import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteTag } from "../../src/lib/actions/tag";
import { readPrivilegedUser } from "../../src/lib/data/user";
import { prisma } from "../../src/lib/prisma";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }));
vi.mock("../../src/lib/data/user", () => ({
  readPrivilegedUser: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    course: { findMany: vi.fn() },
    courseTag: { deleteMany: vi.fn() },
  },
}));

describe("Server Action: deleteTag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should revalidate static paths AND all affected dynamic course paths", async () => {
    (readPrivilegedUser as any).mockReturnValue({ id: "admin", roleLevel: 3 });
    (prisma.course.findMany as any).mockResolvedValue([
      { courseId: "german" },
      { courseId: "french" },
    ]);

    const result = await deleteTag("european");
    expect(result.ok).toBe(true);
    expect(prisma.courseTag.deleteMany).toHaveBeenCalledWith({
      where: { tagId: "european" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/courses");
    expect(revalidatePath).toHaveBeenCalledWith("/courses/german");
    expect(revalidatePath).toHaveBeenCalledWith("/courses/french");
    expect(revalidatePath).toHaveBeenCalledTimes(4);
  });
});
