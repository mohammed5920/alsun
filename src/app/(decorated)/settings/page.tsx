import { redirect } from "next/navigation";
export default async function SettingsWrapper() {
  redirect("/settings/profile");
}
