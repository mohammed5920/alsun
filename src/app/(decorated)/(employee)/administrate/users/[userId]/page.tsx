/* eslint-disable @next/next/no-img-element */
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { DarkSection } from "@/components/alsun/navbar";
import { WithActionOnClick } from "@/components/alsun/withAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, deleteUserEnrollment, updateUserRole } from "@/lib/actions/user";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import { Calendar, Mail, Shield, ShieldAlert, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
};

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const admin = await readUser();

  if (!admin) redirect(`/login?redirect=/administrate/users/${userId}`);
  if (admin.roleLevel < 3) redirect("/");

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        include: {
          module: { include: { course: { include: { tags: true } } } },
        },
      },
    },
  });

  if (!user) redirect("/administrate");

  return (
    <div className="animate-in fade-in flex-col duration-500 transform-gpu">
      <DarkSection>
        <header className="bg-secondary relative w-full overflow-hidden pt-20 pb-6">
          <div className="absolute inset-0 z-10 size-full bg-white/30 mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2dCMVhXIQiv4Ho2zOKhY7LtSCkgBanMNcl6AF)] opacity-30" />
          <div className="relative z-20 flex h-full flex-col items-center justify-center p-4 text-center text-white">
            <Avatar className="mb-4 size-24 border border-white/10 bg-white/10 backdrop-blur-xs">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-transparent text-6xl text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-alsun-serif text-4xl font-bold tracking-tighter text-shadow-md md:text-5xl">
              {user.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-white/70 bg-white/10 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4" />
                <span>Role Level: {user.roleLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Joined on {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </header>
      </DarkSection>

      <main className="px-8 md:px-16 py-6 max-w-7xl mx-auto">
        {admin.roleLevel > user.roleLevel && (
          <div className="bg-white flex justify-between w-full rounded-2xl shadow-md border border-black/10 p-4 items-center">
            <div className="space-y-1">
              <p className="font-bold">Admin Actions</p>
              <p className="text-muted-foreground text-sm hidden md:block">
                Perform administrative actions on this user's account.
              </p>
            </div>

            <div className="flex gap-2 flex-col md:flex-row">
              <div className="text-center">
                {/* would love to use the wrapper instead but alas we must do controlled server components */}
                <label className="text-sm font-medium">Change Role</label>
                <Select
                  name="roleLevel"
                  value={user.roleLevel.toString()}
                  onValueChange={async (level) => {
                    "use server";
                    await updateUserRole({ userId: user!.id, roleLevel: parseInt(level) });
                    revalidatePath(`/administrate/users/${user!.id}`);
                  }}
                >
                  <SelectTrigger className="w-full md:w-fit">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Student</SelectItem>
                    <SelectItem value="2">Teacher</SelectItem>
                    {admin.roleLevel > 3 && <SelectItem value="3">Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="self-end">
                <WithActionOnClick
                  action={async () => {
                    "use server";
                    return deleteUser(user!.id);
                  }}
                  confirmationOptions={{
                    title: "Delete Account",
                    description: `Are you sure you want to delete ${user.name}'s account? This cannot be undone.`,
                  }}
                >
                  <Button
                    variant="destructive"
                    className="hover:shadow-lg transition-all duration-500"
                  >
                    <ShieldAlert className="mr-2 size-4" /> Delete User
                  </Button>
                </WithActionOnClick>
              </div>
            </div>
          </div>
        )}

        <h2 className="my-3 text-3xl font-bold tracking-tight font-alsun-serif">Enrollments</h2>
        {user.enrollments.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>This user has not enrolled in any courses yet.</p>
          </div>
        ) : (
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="hidden md:table-cell">Variant</TableHead>
                    <TableHead className="hidden lg:table-cell">Enrolled On</TableHead>
                    <TableHead className="hidden lg:table-cell">Price Paid</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.enrollments.map((enrollment) => {
                    return (
                      <TableRow key={enrollment.enrollmentId}>
                        <TableCell className="hover:bg-slate-100 transition-colors">
                          <Link
                            href={`/administrate/courses/${enrollment.module.courseId}`}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={enrollment.module.course.thumbnailUrl}
                                alt={enrollment.module.course.title}
                                className="relative flex size-8 shrink-0 overflow-hidden rounded-full"
                              />
                              <div>
                                <p className="font-medium">{enrollment.module.title}</p>
                                <p className="hidden text-sm text-muted-foreground sm:block">
                                  {enrollment.module.course.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="w-fit">
                            <ModuleVariantTypeBadge type={enrollment.variantType} singleRow />
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatPrice(enrollment.pricePaid)}
                        </TableCell>
                        <TableCell className="text-right">
                          <WithActionOnClick
                            confirmationOptions={{
                              title: "Delete Enrollment",
                              description: `Are you sure you want to delete ${user.name}'s enrollment to ${enrollment.module.title}? This will not refund them.`,
                            }}
                            action={async () => {
                              "use server";
                              return deleteUserEnrollment(enrollment.enrollmentId);
                            }}
                          >
                            <button className="p-1.5 border-secondary/20 rounded-md border transition-all hover:border-red-600 hover:bg-red-600 hover:text-white">
                              <Trash strokeWidth={2} className="size-4" />
                            </button>
                          </WithActionOnClick>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
