import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateModule } from "../../src/lib/actions/module"; // CHECK PATH
import { readPrivilegedUser } from "../../src/lib/data/user";
import { prisma } from "../../src/lib/prisma";

const mocks = vi.hoisted(() => {
  const moduleMethods = {
    findFirst: vi.fn(),
    update: vi.fn(),
  };
  const moduleContentMethods = {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  };

  return {
    prisma: {
      module: moduleMethods,
      moduleContent: moduleContentMethods,
      $transaction: vi.fn(async (callback) => {
        return callback({
          module: moduleMethods,
          moduleContent: moduleContentMethods,
        });
      }),
    },
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

vi.mock("../../src/lib/data/user", () => ({ readPrivilegedUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("server-only", () => ({}));

describe("Server Action: updateModule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should BLOCK a teacher from updating a module they don't own", async () => {
    (readPrivilegedUser as any).mockResolvedValue({ id: "mohammed-id", roleLevel: 2 });
    (prisma.module.findFirst as any).mockResolvedValue({
      courseId: "german-101",
      teachers: [{ id: "ahmed-id" }],
    });
    const payload = {
      moduleId: "mod-1",
      description: "Hacked description",
      contents: [],
    };
    const result = await updateModule(payload);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authorised!");
    expect(prisma.module.update).not.toHaveBeenCalled();
  });

  it("should ALLOW a teacher to update their OWN module", async () => {
    (readPrivilegedUser as any).mockResolvedValue({ id: "mohammed-id", roleLevel: 2 });
    (prisma.module.findFirst as any).mockResolvedValue({
      courseId: "german-101",
      teachers: [{ id: "mohammed-id" }], // <--- It's me!
    });
    const result = await updateModule({
      moduleId: "mod-1",
      description: "New Description",
      contents: [],
    });
    expect(result.ok).toBe(true);
    expect(prisma.module.update).toHaveBeenCalledWith({
      where: { moduleId: "mod-1" },
      data: { description: "New Description" },
    });
  });
});
