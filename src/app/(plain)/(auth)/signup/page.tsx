import { readUser } from "@/lib/data/user";
import { ensureArray } from "@/lib/utils";
import { redirect } from "next/navigation";
import SignUp from "./client";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const redirectTo = ensureArray((await searchParams).redirect)[0];
  const user = await readUser();
  if (user) redirect(redirectTo ? redirectTo : "/learn");
  return <SignUp redirectTo={redirectTo} />;
}
