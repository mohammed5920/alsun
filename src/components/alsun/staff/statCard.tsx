import { Enrollment } from "@prisma/client";
import { BarChart3 } from "lucide-react";

export default function Stats({ modules }: { modules: { enrollments: Enrollment[] }[] }) {
  const WeekAgo = new Date();
  WeekAgo.setDate(WeekAgo.getDate() - 7);

  return (
    <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <BarChart3 className="text-secondary h-6 w-6" />
        <h2 className="font-alsun-serif text-secondary ml-3 text-xl font-semibold">At a Glance</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-secondary text-3xl font-bold">{modules.length}</p>
          <p className="text-sm text-slate-500">Modules</p>
        </div>
        <div>
          <p className="text-secondary text-3xl font-bold">
            {modules.map((module) => module.enrollments).reduce((a, b) => a + b.length, 0)}
          </p>
          <p className="text-sm text-slate-500">Students</p>
        </div>
        <div>
          <p className="text-primary text-3xl font-bold">
            +
            {modules
              .map(
                (module) =>
                  module.enrollments.filter((enrollment) => enrollment.enrolledAt >= WeekAgo).length
              )
              .reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-sm text-slate-500">New This Week</p>
        </div>
      </div>
    </div>
  );
}
