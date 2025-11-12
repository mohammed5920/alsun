import { readUser } from "@/lib/data/user";
import { redirect } from "next/navigation";
import AccountSecuritySettings from "./client";

export default async function SecurityWrapper() {
  const user = await readUser();
  if (!user) redirect("/login?redirect=/settings/security");
  return <AccountSecuritySettings />;
}
