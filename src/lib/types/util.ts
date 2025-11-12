export type Strip<T> = Omit<T, "createdAt" | "updatedAt">;
export type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };
