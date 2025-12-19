"use client";

import { CourseTagBadge, CourseTagStyles } from "@/components/alsun/marketing/courseTagBadge";
import { StoreCourseCard } from "@/components/alsun/marketing/storeCourseCard";
import { Input } from "@/components/ui/input";
import { CourseTag, CourseTagType } from "@/generated/prisma/browser";
import { TaggedCourse } from "@/lib/types/course";
import { groupTags, toggleTag } from "@/lib/types/tags";
import { ensureArray } from "@/lib/utils";
import { Compass } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export type FilterType = {
  search: string;
  tags: CourseTag[];
};

export default function Home({ summaries }: { summaries: TaggedCourse[] }) {
  const searchParams = useSearchParams();
  const tagNames = ensureArray(searchParams.get("tags") || "");

  const tagMap = new Map<string, CourseTag>();
  summaries.flatMap((s) => s.tags).forEach((tag) => tagMap.set(tag.name.toLowerCase(), tag));
  const [filter, setFilter] = useState<FilterType>({
    search: "",
    tags: tagNames
      .filter((name) => tagMap.has(name.toLowerCase()))
      .map((name) => tagMap.get(name)!),
  });

  const filteredSummaries = summaries.filter((summary) => {
    if (
      filter.search &&
      !summary.title.toLowerCase().includes(filter.search.toLowerCase()) &&
      !summary.tags.find((tag) => tag.name.toLowerCase().includes(filter.search.toLowerCase()))
    )
      return false;
    return (
      filter.tags.length === 0 ||
      summary.tags.some((stag) =>
        filter.tags.some((ftag) => stag.name.toLowerCase() === ftag.name.toLowerCase())
      )
    );
  });

  return (
    <div className="animate-in fade-in transform-gpu duration-500">
      <HeroSection searchQuery={filter.search} setFilter={setFilter} />
      <div className="mx-auto md:w-fit px-8 md:px-16 flex flex-col gap-6 py-6 lg:flex-row">
        <FilterSidebar
          allTags={[...tagMap.values()]}
          selectedTags={filter.tags}
          setFilter={setFilter}
        />
        <CoursesContainer filteredSummaries={filteredSummaries} />
      </div>
    </div>
  );
}

function HeroSection({
  searchQuery,
  setFilter,
}: {
  searchQuery: string;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}) {
  return (
    <div className="from-secondary to-primary mt-20 w-full overflow-hidden bg-linear-to-br py-10 text-center text-white">
      <h1 className="font-alsun-serif mb-4 text-5xl font-extrabold tracking-tight md:text-5xl">
        Your Next Language Adventure
      </h1>
      <p className="mx-auto mb-4 max-w-2xl px-2 text-xl text-white/50">
        Explore courses taught by world-class instructors.
      </p>
      <div className="relative mx-auto max-w-xl">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search..."
          className="w-3/4 rounded-full bg-white/20 py-2 text-center text-lg text-white transition-all duration-300 placeholder:text-white/70 focus:outline-none mx-auto border-0"
        />
      </div>
    </div>
  );
}

function FilterSidebar({
  allTags,
  selectedTags,
  setFilter,
}: {
  allTags: CourseTag[];
  selectedTags: CourseTag[];
  setFilter: Dispatch<SetStateAction<FilterType>>;
}) {
  const groupedTags = groupTags(allTags);

  return (
    <aside className="h-fit w-full rounded-2xl bg-white/60 p-6 shadow-md ring-1 ring-black/5 backdrop-blur-lg lg:max-w-xs">
      <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
        <Compass className="text-primary" />
        Explore Courses
      </h3>

      <div>
        {Object.entries(groupedTags).map(([type, tags], idx) => {
          const style = CourseTagStyles[type as CourseTagType];
          const { icon: Icon } = style;

          return (
            <div key={type} className={idx ? "mb-2 border-t pt-2" : "mb-2"}>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Icon className="size-3.5" />
                {type}
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.tagId}
                    className="cursor-pointer transition-all duration-500 hover:saturate-200"
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        tags: toggleTag(prev.tags, tag),
                      }))
                    }
                  >
                    <CourseTagBadge
                      tag={tag}
                      active={!!selectedTags.find((selected) => selected.name === tag.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function CoursesContainer({ filteredSummaries }: { filteredSummaries: TaggedCourse[] }) {
  return (
    <main className="max-w-7xl">
      {filteredSummaries ? (
        filteredSummaries.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 w-full justify-items-center gap-3">
            {filteredSummaries.map((summary) => (
              <div key={summary.courseId} className="animate-in fade-in">
                <StoreCourseCard metadata={summary} />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in rounded-2xl bg-white/60 py-24 text-center shadow-lg ring-1 ring-black/5 backdrop-blur-lg">
            <h2 className="text-secondary text-3xl font-bold">No Courses Found</h2>
            <p className="mx-auto mt-4 max-w-sm text-slate-500">
              Perhaps your search is too specific. Try adjusting the filters to discover new
              adventures!
            </p>
          </div>
        )
      ) : (
        <div className="rounded-2xl bg-white/60 py-24 text-center shadow-lg ring-1 ring-black/5 backdrop-blur-lg">
          <h2 className="text-secondary text-3xl font-bold">Loading...</h2>
        </div>
      )}
    </main>
  );
}
