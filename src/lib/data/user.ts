import { headers } from "next/headers";
import "server-only";
import { auth } from "../auth";

export async function readUser() {
  return (await auth.api.getSession({ headers: await headers() }))?.user || null;
}

export async function readPrivilegedUser(level: number) {
  const user = await readUser();
  return !user || user.roleLevel < level ? null : user;
}
