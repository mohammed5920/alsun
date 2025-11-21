import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteUser, grantOwner, updateUserRole } from "../../src/lib/actions/user";
import { readPrivilegedUser, readUser } from "../../src/lib/data/user";
import { prisma } from "../../src/lib/prisma";

vi.mock("server-only", () => {
  return {};
});

vi.mock("../../src/lib/data/user", () => ({
  readPrivilegedUser: vi.fn(),
  readUser: vi.fn(),
}));

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("Server Action: updateUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should prevent privilege escalation (Security Check)", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    const result = await updateUserRole({ userId: "target-id", roleLevel: 4 });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("greater than or equal to your role level");
  });

  it("should prevent modifying a peer (RBAC Check)", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 3 });
    const result = await updateUserRole({ userId: "target-id", roleLevel: 1 });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("same or higher level");
  });

  it("should prevent modifying a superior (RBAC Check)", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 4 });
    const result = await updateUserRole({ userId: "target-id", roleLevel: 1 });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("same or higher level");
  });

  it("should succeed if all checks pass", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 1 });
    const result = await updateUserRole({ userId: "target-id", roleLevel: 2 });
    expect(result.ok).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "target-id" },
      data: { roleLevel: 2 },
    });
  });
});

describe("Server Action: deleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("should prevent the user deleting their own account", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    const result = await deleteUser("my-id");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("delete your own account");
  });

  it("should prevent deleting a peer (RBAC Check)", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 3 });
    const result = await deleteUser("target-id");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Not authorised");
  });

  it("should prevent deleting a superior (RBAC Check)", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 4 });
    const result = await deleteUser("target-id");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Not authorised");
  });

  it("should succeed if all checks pass", async () => {
    readPrivilegedUser.mockResolvedValue({ id: "my-id", roleLevel: 3 });
    prisma.user.findFirst.mockResolvedValue({ id: "target-id", roleLevel: 1 });
    const result = await deleteUser("target-id");
    expect(result.ok).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: "target-id" },
    });
  });
});

describe("Server Action: grantOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should exit early if the password's bad", async () => {
    const result = await grantOwner("a");
    expect(result.error).toContain("Bad");
  });

  it("should not grant owner if owner already exists", async () => {
    vi.stubEnv("MASTER_PASSWORD", "secret123");
    readUser.mockResolvedValue({ id: "my-id" });
    prisma.user.count.mockImplementation(
      async (args: { where: { id: string; roleLevel: number } }) => {
        if (args?.where?.id === "my-id") return 1;
        if (args?.where?.roleLevel === 4) return 1;
        throw new Error("Bad args");
      }
    );
    const result = await grantOwner("secret123");
    expect(result.error).toContain("exists");
  });

  it("should successfully grant owner if user exists and no owner exists", async () => {
    vi.stubEnv("MASTER_PASSWORD", "secret123");
    readUser.mockResolvedValue({ id: "my-id" });
    prisma.user.count.mockImplementation(
      async (args: { where: { id: string; roleLevel: number } }) => {
        if (args?.where?.id === "my-id") return 1;
        if (args?.where?.roleLevel === 4) return 0;
        throw new Error("Bad args");
      }
    );
    const result = await grantOwner("secret123");
    expect(result.ok).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "my-id" },
      data: { roleLevel: 4 },
    });
  });
});
