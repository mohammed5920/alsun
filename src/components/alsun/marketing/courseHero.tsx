/* eslint-disable @next/next/no-img-element */

import { CourseTag } from "@/generated/prisma/browser";
import Link from "next/link";
import { DarkSection } from "../navbar";
import { CourseTagBadge } from "./courseTagBadge";

export function CourseHero({
  course,
}: {
  course: {
    title: string;
    description: string;
    thumbnailUrl: string | null;
    tags: CourseTag[];
  };
}) {
  return (
    <DarkSection>
      <header className="bg-secondary relative max-w-screen overflow-hidden pt-12">
        <div className="absolute inset-0 z-10 size-full bg-white/30 mask-[url(https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2dCMVhXIQiv4Ho2zOKhY7LtSCkgBanMNcl6AF)] opacity-30" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 p-6 lg:flex-row lg:gap-12 lg:p-12">
          <div className="bg-secondary p-4 text-center lg:p-8 lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 mix-blend-screen grayscale invert lg:justify-start">
              {course.tags.map((tag) => (
                <Link
                  key={tag.tagId}
                  href={`/courses?tags=${tag.name.toLowerCase()}`}
                  className="hover:brightness-90 transition hover:-translate-y-1 hover:shadow-md shadow-black/10 rounded-full"
                >
                  <CourseTagBadge tag={tag} />
                </Link>
              ))}
            </div>
            <h1 className="font-alsun-serif mb-6 max-w-2xl text-5xl font-bold tracking-tighter text-balance text-white md:text-6xl">
              {course.title || "Untitled Course"}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-balance text-white/50 md:text-2xl lg:mx-0">
              {course.description || "Describe your course!"}
            </p>
          </div>
          <div className="shadow-secondary/20 aspect-video max-w-md rounded-2xl shadow-2xl">
            <img
              src={
                course.thumbnailUrl || "https://placehold.co/640x480/f1f5f9/cbd5e1?text=Thumbnail"
              }
              alt="Course Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>
    </DarkSection>
  );
}
