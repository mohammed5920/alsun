/* eslint-disable @next/next/no-img-element */
"use client";

import { WithActionOnSubmit } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user";
import { authClient } from "@/lib/auth-client";
import { UpdateUserSchema } from "@/lib/types/user";
import { UploadButton } from "@/lib/uploadthing";
import { User } from "@prisma/client";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileSettings({ initialUser }: { initialUser: User }) {
  const [data, setData] = useState({
    name: initialUser.name,
    image: initialUser.image,
    bio: initialUser.bio,
    email: initialUser.email,
  });

  const handleThumbnailUpload = (res: { ufsUrl: string }[]) => {
    setData((prev) => ({ ...prev, image: res[0].ufsUrl }));
    toast.info("Avatar uploaded.");
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <header className="border-b pb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-1">Change your profile data.</p>
      </header>
      <WithActionOnSubmit
        beforeAction={() => {
          const res = UpdateUserSchema.safeParse(data);
          if (!res.success) toast.error(res.error.issues[0].message);
          return res.success;
        }}
        action={() => updateUser(data)}
        onSuccess={async () => {
          await authClient.getSession({
            query: {
              disableCookieCache: true,
            },
          });
          authClient.$store.notify("$sessionSignal"); //undocumented way to force reactive store update, may be risky
          toast.success("Updated successfully");
        }}
      >
        <div className="mt-6 space-y-4">
          <label className="text-secondary mb-2 block text-sm font-semibold">Profile Picture</label>

          <div className="flex items-center gap-4">
            {data.image ? (
              <img className="size-40 rounded-full object-cover" src={data.image} alt="Profile" />
            ) : (
              <UserIcon className="size-20 rounded-full bg-slate-100 p-1" strokeWidth={1} />
            )}

            <div className="flex flex-col gap-2">
              <UploadButton
                endpoint="imageUploader"
                className="bg-primary rounded-lg px-1 text-xs text-white transition-all hover:bg-teal-800"
                onUploadBegin={() => toast.info("Uploading...")}
                onUploadError={() => {
                  toast.error("Failed to upload thumbnail");
                }}
                onClientUploadComplete={handleThumbnailUpload}
                appearance={{ allowedContent: "hidden" }}
              />
              <Button
                onClick={() => setData((prev) => ({ ...prev, image: null }))}
                variant="destructive"
                className="text-xs cursor-pointer hover:bg-red-700"
              >
                Remove
              </Button>
            </div>
          </div>

          <label htmlFor="email" className="text-secondary text-sm font-semibold">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
            className="focus:border-primary block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
          />
          <div>
            <label htmlFor="name" className="text-secondary text-sm font-semibold">
              Full Name
            </label>
            <Input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
              className="focus:border-primary mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="bio" className="text-secondary text-sm font-semibold">
              Short Bio
            </label>
            <Textarea
              id="bio"
              rows={2}
              className="focus:border-primary mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-all focus:ring-0 focus:outline-none"
              value={data.bio || undefined}
              onChange={(e) => setData((prev) => ({ ...prev, bio: e.target.value }))}
            />
            <p className="mt-2 text-xs text-slate-400">
              Brief description for your profile. URLs are hyperlinked.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
          <Button type="submit">Save Changes</Button>
        </div>
      </WithActionOnSubmit>
    </div>
  );
}
