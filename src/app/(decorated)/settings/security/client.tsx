"use client";

import { WithActionOnClick, WithActionOnSubmit } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { deleteSelf, updateUserPassword } from "@/lib/actions/user";
import { authClient } from "@/lib/auth-client";
import { UpdateUserPasswordSchema } from "@/lib/types/user";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AccountSecuritySettings() {
  const router = useRouter();
  const [data, setData] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <header className="border-b pb-6">
        <h2 className="text-2xl font-bold">Account & Security</h2>
        <p className="mt-1">Manage your login credentials and keep your account secure.</p>
      </header>
      <WithActionOnSubmit
        beforeAction={() => {
          const res = UpdateUserPasswordSchema.safeParse(data);
          if (!res.success) toast.error(res.error.issues[0].message);
          return res.success;
        }}
        action={() => updateUserPassword(data)}
        onSuccess={async () => {
          await authClient.revokeOtherSessions();
          toast.success("Updated successfully");
        }}
      >
        <div className="mt-6 space-y-2">
          <label className="text-secondary text-sm font-semibold">Current Password</label>
          <input
            value={data.oldPass}
            onChange={(e) => setData((prev) => ({ ...prev, oldPass: e.target.value }))}
            type="password"
            placeholder="Current Password"
            className="focus:border-primary block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
          />
          <label className="text-secondary text-sm font-semibold">New Password</label>
          <input
            value={data.newPass}
            onChange={(e) => setData((prev) => ({ ...prev, newPass: e.target.value }))}
            type="password"
            placeholder="New Password"
            className="focus:border-primary block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
          />
          <label htmlFor="confirmPass" className="text-secondary text-sm font-semibold">
            Confirm New Password
          </label>
          <input
            value={data.confirmPass}
            onChange={(e) => setData((prev) => ({ ...prev, confirmPass: e.target.value }))}
            type="password"
            placeholder="Confirm New Password"
            className="focus:border-primary block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
          <WithActionOnClick
            action={deleteSelf}
            confirmationOptions={{
              title: "Delete account",
              description:
                "Are you sure you want to delete your account? This will not refund any of your enrollments.",
            }}
            onSuccess={async () => {
              await authClient.signOut();
              router.push("/");
            }}
          >
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 font-bold text-white shadow-md transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden md:inline">Delete Account</span>
            </button>
          </WithActionOnClick>
          <Button type="submit">Update Account</Button>
        </div>
      </WithActionOnSubmit>
    </div>
  );
}
