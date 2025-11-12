import { WithActionOnClick } from "@/components/alsun/withAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser } from "@/lib/actions/user";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import { Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUserProfilePage() {
  const admin = await readUser();

  if (!admin) redirect(`/login?redirect=/administrate/users`);
  if (admin.roleLevel < 3) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        select: { enrollmentId: true },
      },
    },
  });

  return (
    <div className="animate-in fade-in flex-col duration-500 transform-gpu">
      <div className="mt-20 max-w-7xl mx-auto px-8 md:px-16">
        <div className="mb-8">
          <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            Users
          </h1>
          <p className="mt-2 text-lg text-slate-500">Manage all users.</p>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="hover:bg-slate-100 transition-colors">
                        <Link href={`/administrate/users/${user.id}`} className="cursor-pointer">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.image ?? undefined} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="hidden text-sm text-muted-foreground sm:block">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {user.roleLevel > 0 && user.roleLevel < 5
                          ? `${["Student", "Teacher", "Admin", "Owner"][user.roleLevel - 1]}`
                          : user.roleLevel}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt.toLocaleDateString()}
                      </TableCell>
                      {user.roleLevel < admin.roleLevel && (
                        <TableCell className="text-right">
                          <WithActionOnClick
                            action={async () => {
                              "use server";
                              return deleteUser(user.id);
                            }}
                            confirmationOptions={{
                              title: "Delete Account",
                              description: `Are you sure you want to delete ${user.name}'s account? This cannot be undone.`,
                            }}
                          >
                            <button className="p-1.5 border-secondary/20 rounded-md border transition-all hover:border-red-600 hover:bg-red-600 hover:text-white">
                              <Trash strokeWidth={2} className="size-4" />
                            </button>
                          </WithActionOnClick>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
