import { Clock, LucideProps } from "lucide-react";

export default function RecentActivity({
  recent,
}: {
  recent: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text: string;
    date: Date;
  }[];
}) {
  return (
    <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <Clock className="text-secondary h-6 w-6" />
        <h2 className="font-alsun-serif text-secondary ml-3 text-xl font-semibold">
          Recent Activity
        </h2>
      </div>
      <ul className="space-y-4">
        {recent.slice(0, 6).map((activity) => (
          <li key={activity.text + activity.date.toISOString()} className="flex items-start gap-3">
            <div className="rounded-full bg-slate-100 p-2">
              <activity.icon className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700">{activity.text}</p>
              <p className="text-xs text-slate-400">{activity.date.toDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
