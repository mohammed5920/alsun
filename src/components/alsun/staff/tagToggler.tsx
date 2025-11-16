"use client";

import { CourseTagBadge, CourseTagStyles } from "@/components/alsun/marketing/courseTagBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTag, deleteTag } from "@/lib/actions/tag";
import { groupTags, toggleTag } from "@/lib/types/tags";
import { CourseTag, CourseTagType } from "@prisma/client";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WithActionOnClick, WithActionOnSubmit } from "../withAction";

export function TagToggler({
  categories,
  initialTags,
  selectedTags = [],
  setSelectedTags,
}: {
  categories: CourseTagType[];
  initialTags: CourseTag[];
  selectedTags?: CourseTag[];
  setSelectedTags: (selection: CourseTag[]) => void;
}) {
  const [allTags, setAllTags] = useState<CourseTag[]>(initialTags);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState<CourseTagType | null>(null);
  const groupedTags = groupTags(allTags);

  return (
    <div className="overflow-clip rounded-xl bg-white">
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="items-baseline flex gap-2">
          <h3 className="font-semibold text-slate-800">Manage Tags</h3>
          <span
            className={`tracking-widest uppercase text-xs ${selectedTags.length ? "text-secondary/50" : "text-red-600"}`}
          >
            {" "}
            | {selectedTags.length} selected
          </span>
        </div>
        <Button
          variant={isDeleting ? "destructive" : "outline"}
          size="sm"
          onClick={() => setIsDeleting(!isDeleting)}
        >
          {isDeleting ? <X className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
          {isDeleting ? "Cancel" : "Delete Tags"}
        </Button>
      </div>

      {categories.map((cat) => {
        const style = CourseTagStyles[cat];
        const { icon: Icon } = style;
        const tagsForCategory = groupedTags[cat] ?? [];

        return (
          <div key={cat} className="border-b border-slate-200 last:border-b-0">
            <div className="flex w-full items-center gap-3 p-3 text-left">
              <Icon className="size-5 text-slate-500" />
              <span className="font-semibold text-slate-700">{cat}</span>
            </div>

            <div className="flex flex-wrap gap-2 p-3 pt-1 items-center">
              {tagsForCategory.map((tag) => {
                const badge = (
                  <CourseTagBadge
                    tag={tag}
                    active={!!selectedTags.find((mtag) => mtag.tagId === tag.tagId)}
                  />
                );
                return isDeleting ? (
                  <WithActionOnClick
                    key={tag.tagId}
                    action={() => deleteTag(tag.tagId)}
                    confirmationOptions={{
                      title: "Delete Tag?",
                      description: `Are you sure you want to permanently delete the "${tag.name}" tag?`,
                    }}
                    onSuccess={() => {
                      setAllTags((prev) => prev.filter((t) => t.tagId !== tag.tagId));
                      setSelectedTags(selectedTags.filter((t) => t.tagId !== tag.tagId));
                      toast.success(`Tag "${tag.name}" deleted.`);
                    }}
                  >
                    <div className="bg-red-600 rounded-full">
                      <div className="relative cursor-pointer grayscale mix-blend-screen">
                        {badge}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-red-600 opacity-0 transition-opacity hover:opacity-100">
                          <X className="size-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </WithActionOnClick>
                ) : (
                  <div
                    key={tag.tagId}
                    className="cursor-pointer transition hover:scale-105 hover:shadow-md rounded-full"
                    onClick={() => setSelectedTags(toggleTag(selectedTags, tag))}
                  >
                    {badge}
                  </div>
                );
              })}

              {!isDeleting &&
                (addingToCategory === cat ? (
                  <WithActionOnSubmit
                    beforeAction={(formData) => {
                      const name = formData.get("name") as string;
                      if (!name?.trim()) toast.error("Tag name cannot be empty");
                      return !!name?.trim();
                    }}
                    action={(formData) =>
                      createTag({ name: formData.get("name") as string, type: cat })
                    }
                    onSuccess={(newTag) => {
                      setAllTags((prev) => [...prev, newTag]);
                      setAddingToCategory(null);
                      toast.success(`Tag "${newTag.name}" created.`);
                    }}
                  >
                    <div className="flex items-center gap-0.5 ring-1 rounded-md ring-slate-300 pl-2">
                      <Input
                        name="name"
                        placeholder="New tag..."
                        className="h-3.5 w-14 border-none bg-transparent p-0 text-xs focus-visible:ring-0"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setAddingToCategory(null);
                        }}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="size-6 hover:bg-primary/20"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-6 hover:bg-red-600/20"
                        onClick={() => setAddingToCategory(null)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </WithActionOnSubmit>
                ) : (
                  <button
                    onClick={() => setAddingToCategory(cat)}
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-dashed ring-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Plus className="mr-1.5 size-3.5" />
                    Add Tag
                  </button>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
