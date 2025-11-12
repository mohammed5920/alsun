import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BillingHistory() {
  const user = await readUser();
  if (!user) redirect("/login?redirect=/settings/profile");
  const enrollments = await prisma.enrollment.findMany({ where: { studentId: user.id } });
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <header className="border-b pb-6">
        <h2 className="text-2xl font-bold">Billing History</h2>
        <p className="mt-1">Review your past payments and download invoices.</p>
      </header>

      {enrollments.length !== 0 && (
        <Table className="w-full text-left">
          <TableHeader className="border-b border-slate-200 text-sm text-slate-500">
            <TableRow>
              <TableHead className="py-3 font-medium">Invoice</TableHead>
              <TableHead className="py-3 font-medium">Date</TableHead>
              <TableHead className="py-3 font-medium">Amount</TableHead>
              <TableHead className="py-3 text-right font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.enrollmentId}>
                <TableCell className="text-secondary py-4 font-semibold">
                  {enrollment.enrollmentId}
                </TableCell>
                <TableCell className="py-4 text-slate-600">
                  {enrollment.enrolledAt.toDateString()}
                </TableCell>
                <TableCell className="py-4 text-slate-600">{enrollment.pricePaid}</TableCell>
                <TableCell className="py-4 text-right">
                  <a
                    href="#"
                    className="text-primary inline-flex items-center gap-2 font-semibold hover:text-teal-800"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {enrollments.length === 0 && (
        <span className="mt-6 block text-center tracking-widest uppercase opacity-50">
          no purchase history
        </span>
      )}
    </div>
  );
}
