import { Strip } from "@/lib/types/util";
import { Course, CourseTag } from "@prisma/client";
import Link from "next/link";
import { CourseTagBadge } from "./courseTagBadge";

/* eslint-disable @next/next/no-img-element */
export function StoreCourseCard({ metadata }: { metadata: Strip<Course> & { tags: CourseTag[] } }) {
  return (
    <Link
      href={metadata.courseId && metadata.isPublic ? `/courses/${metadata.courseId}` : ""}
      className="h-fit w-fit"
    >
      <div className="fade-in max-w-xs overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300 hover:scale-102">
        <div className="relative">
          <img
            className="h-40 w-full object-cover"
            src={
              metadata.thumbnailUrl || "https://placehold.co/600x400/f1f5f9/cbd5e1?text=Thumbnail"
            }
            alt={metadata.title}
          />
          <div className="from-secondary/80 via-secondary/10 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-alsun-serif text-2xl font-bold tracking-tight text-white text-shadow-black text-shadow-sm">
              {metadata.title || "Title"}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <p className="mb-4 text-sm text-slate-500">{metadata.description || "Desc..."}</p>
          <div className="flex flex-wrap gap-2 border-t py-3">
            {metadata.tags?.map((tag) => (
              <CourseTagBadge key={tag.tagId} tag={tag} />
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-primary h-fit w-full gap-1 text-right text-sm font-semibold transition-opacity duration-300">
              {metadata.isPublic ? <span>View Details &rarr;</span> : "Coming Soon!"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
