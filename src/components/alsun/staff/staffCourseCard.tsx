/* eslint-disable @next/next/no-img-element */
import { Course } from "@prisma/client";
import { BookOpen, CheckCircle, EditIcon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

export function StaffCourseCard({
  course,
  link,
  moduleCount,
  studentCount,
  children,
}: {
  course: Pick<Course, "thumbnailUrl" | "isPublic" | "title">;
  link: string;
  moduleCount: number;
  studentCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col bg-white rounded-xl w-full shadow-md border border-slate-200 overflow-hidden group">
      <div className="relative">
        <Link href={link} className={link ? "" : "cursor-default"}>
          <img
            src={
              course.thumbnailUrl ||
              `https://placehold.co/600x400/f1f5f9/cbd5e1?text=${course.title || "Untitled course"}`
            }
            alt={course.title || "Untitled course"}
            className="w-full h-40 object-cover"
          />
        </Link>
        <span
          className={`absolute bottom-0 right-0 left-0 flex justify-center gap-2 tracking-widest uppercase p-1 px-2 text-xs w-full backdrop-blur-sm text-white/80 ${course.isPublic ? "bg-teal-700/50" : "bg-slate-800/50"}`}
        >
          {course.isPublic ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Published
            </>
          ) : (
            <>
              <EditIcon className="h-4 w-4" />
              Not Published
            </>
          )}
        </span>
      </div>
      <div className="px-5 py-2">
        <div className="flex items-center align-middle gap-2 justify-between">
          <h3 className="text-lg h-fit font-bold text-slate-800">
            {course.title || "Untitled course"}
          </h3>
        </div>
        <div className="flex items-center gap-6 justify-between text-sm text-slate-500 mt-2">
          <span className="flex items-center gap-1.5 text-nowrap">
            <Users className="h-4 w-4" /> {studentCount} Student
            {studentCount === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1.5 text-nowrap">
            <BookOpen className="h-4 w-4" /> {moduleCount} Module
            {moduleCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50">{children}</div>
    </div>
  );
}
