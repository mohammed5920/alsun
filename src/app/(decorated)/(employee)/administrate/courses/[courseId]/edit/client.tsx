/* eslint-disable @next/next/no-img-element */
"use client";

import { CourseHero } from "@/components/alsun/marketing/courseHero";
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { TagToggler } from "@/components/alsun/staff/tagToggler";
import { WithActionOnSubmit } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateCourse } from "@/lib/actions/course";
import { CourseUpdateSchema } from "@/lib/types/course";
import { Strip } from "@/lib/types/util";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import {
  Course,
  CourseTag,
  CourseTagType,
  Module,
  ModuleVariant,
  ModuleVariantType,
} from "@prisma/client";
import { produce } from "immer";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Edit,
  PlusCircle,
  SaveIcon,
  Trash,
  Users,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type EditableVariant = Omit<ModuleVariant, "moduleId" | "variantId">;
type EditableModule = Strip<Module> & {
  teacherIds: string[];
  variants: EditableVariant[];
  enrollments: { enrollmentId: string }[];
};
type EditableCourse = Omit<Course, "createdAt" | "updatedAt"> & {
  tags: CourseTag[];
} & {
  modules: EditableModule[];
};

export default function CourseEditor({
  initialCourse,
  allTags,
  allTeachers,
}: {
  initialCourse: EditableCourse;
  allTags: CourseTag[];
  allTeachers: { id: string; name: string; image: string | null }[];
}) {
  const [course, setCourse] = useState(initialCourse);

  const addModule = () => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        draft.modules.push({
          moduleId: crypto.randomUUID(),
          index: course.modules.length > 0 ? (course.modules.at(-1)!.index / 10 + 1) * 10 : 0,
          title: "",
          description: "",
          courseId: draft.courseId,
          teacherIds: [],
          variants: [],
          enrollments: [],
        });
      })
    );
  };

  return (
    <div className="animate-in fade-in transform-gpu duration-500">
      <CourseHero course={course} />
      <div className="mx-auto my-4 grid grid-cols-1 gap-3 lg:grid-cols-5 px-4 md:px-16">
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <MetadataCard course={course} setCourse={setCourse} />
          <div className="p-2 bg-white shadow-md rounded-lg">
            <TagToggler
              initialTags={allTags}
              selectedTags={course.tags}
              setSelectedTags={(selection) => setCourse((prev) => ({ ...prev, tags: selection }))}
              categories={Object.values(CourseTagType)}
            />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <WithActionOnSubmit
            beforeAction={() => {
              const parsed = CourseUpdateSchema.safeParse(course);
              if (!parsed.success) toast.error(parsed.error.issues[0].message);
              return parsed.success;
            }}
            action={() => updateCourse(course)}
            onSuccess={() => toast.success(`Course updated successfully.`)}
            dontSubmitOnEnter
          >
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
                <div className="flex items-center gap-4">
                  <h2 className="font-alsun-serif text-secondary text-3xl">
                    {course.title || "Untitled Course"}
                  </h2>
                  {course.isPublic ? (
                    <div className="text-primary bg-primary/20 flex items-center gap-2 rounded-full px-3 py-1 text-sm">
                      <CheckCircle size={16} /> Public
                    </div>
                  ) : (
                    <div className="text-secondary bg-secondary/20 flex items-center gap-2 rounded-full px-3 py-1 text-sm">
                      <Edit size={16} /> Private
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className={`${
                      course.isPublic
                        ? "bg-secondary hover:bg-slate-900"
                        : "bg-primary hover:bg-teal-800"
                    }`}
                    onClick={() => setCourse((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
                  >
                    {course.isPublic ? "Make Private" : "Make Public"}
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-teal-700">
                    <SaveIcon />
                    Save Changes
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <ModuleCard
                    key={module.moduleId}
                    module={module}
                    setCourse={setCourse}
                    allTeachers={allTeachers}
                  />
                ))}
              </div>
              <Button
                className="bg-primary w-full hover:bg-teal-700"
                type="button"
                onClick={addModule}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
          </WithActionOnSubmit>
        </div>
      </div>
    </div>
  );
}

function MetadataCard({
  course,
  setCourse,
}: {
  course: EditableCourse;
  setCourse: Dispatch<SetStateAction<EditableCourse>>;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCourse((prev) => ({ ...prev, [id]: value }));
  };

  const handleThumbnailUpload = (res: { ufsUrl: string }[]) => {
    setCourse((prev) => ({ ...prev, thumbnailUrl: res[0].ufsUrl }));
    toast.info("Thumbnail uploaded.");
  };

  return (
    <div className="w-full space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Course Settings</CardTitle>
          <CardDescription>Manage your course details and settings.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2">
            <div className="grow">
              <label htmlFor="title" className="text-secondary text-sm">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter title..."
                value={course.title}
                onChange={handleInputChange}
                required={true}
                className="border-slate-300 not-focus:placeholder:text-red-600 not-focus:placeholder-shown:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-1">
            <div className="grow">
              <label htmlFor="description" className="text-secondary mt-3 block text-sm">
                Description
              </label>
              <textarea
                id="description"
                value={course.description}
                placeholder="Enter description..."
                required={true}
                rows={3}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-slate-300 p-2 not-focus:placeholder:text-red-600 not-focus:placeholder-shown:border-red-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-secondary mt-3 -mb-2 block text-sm">Course Thumbnail</label>
              <div className="relative">
                <div
                  className="absolute inset-0 z-0 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: course.thumbnailUrl ? `url(${course.thumbnailUrl})` : "none",
                  }}
                />
                <UploadDropzone
                  className={`z-10! p-2! backdrop-blur-xs ${
                    !!course.thumbnailUrl && "bg-black/20!"
                  }`}
                  appearance={{
                    button: "bg-primary px-2",
                    uploadIcon: "hidden size-20 -mt-3 text-primary",
                    container: "bg-white border-slate-300 h-min",
                    label: course.thumbnailUrl
                      ? "text-white text-shadow-xs text-shadow-black mt-0!"
                      : "mt-0!",
                    allowedContent: course.thumbnailUrl ? "text-white" : "",
                  }}
                  endpoint="imageUploader"
                  onUploadBegin={() => toast.info("Uploading...")}
                  onUploadError={() => {
                    toast.error("Failed to upload thumbnail");
                  }}
                  onClientUploadComplete={handleThumbnailUpload}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ModuleCard({
  module,
  setCourse,
  allTeachers,
}: {
  module: EditableCourse["modules"][number];
  setCourse: Dispatch<SetStateAction<EditableCourse>>;
  allTeachers: { id: string; name: string; image: string | null }[];
}) {
  const [openCombobox, setOpenCombobox] = useState(false);

  const handleModuleFieldChange = (field: "title" | "description", value: string) => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        draft.modules[module.index / 10][field] = value;
      })
    );
  };

  const deleteModule = () => {
    if (module.enrollments.length > 0)
      return toast.error("Can't delete a module with enrolled students!");
    setCourse((prev) =>
      produce(prev, (draft) => {
        draft.modules = draft.modules.filter((m) => m.moduleId !== module.moduleId);
        draft.modules.forEach((module, index) => (module.index = index * 10));
      })
    );
  };

  const toggleTeacher = (teacherId: string) => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        const targetModule = draft.modules[module.index / 10];
        const isSelected = targetModule.teacherIds.includes(teacherId);
        if (isSelected) {
          targetModule.teacherIds = targetModule.teacherIds.filter((id) => id !== teacherId);
        } else {
          targetModule.teacherIds.push(teacherId);
        }
      })
    );
  };

  const handleIndexChange = (amount: number) => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        draft.modules[module.index / 10].index += amount;
        draft.modules.sort((a, b) => a.index - b.index);
        draft.modules.forEach((module, index) => (module.index = index * 10));
      })
    );
  };

  return (
    <div className="border-primary/20 rounded-2xl border-l-8 bg-white p-4 shadow-sm">
      <div className="flex justify-between items-end">
        <label className="text-secondary/40">Module {module.index / 10 + 1} Title</label>
        <div className="flex gap-1 bg-slate-100 rounded-md p-1 text-secondary/50 mb-1">
          <ArrowUp
            className="size-5 bg-slate-200 hover:bg-slate-300 transition-colors p-1 rounded-md"
            onClick={() => handleIndexChange(-15)}
          />
          <ArrowDown
            className="size-5 bg-slate-200 hover:bg-slate-300 transition-colors p-1 rounded-md"
            onClick={() => handleIndexChange(15)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={module.title}
          placeholder="Enter module name..."
          required={true}
          onChange={(e) => handleModuleFieldChange("title", e.target.value)}
          className="text-secondary placeholder:text-secondary/40 focus:border-primary focus:ring-primary border-slate-300"
        />
        <div className="bg-secondary/10 flex gap-2 rounded-md p-1">
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild className="rounded-md">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="text-secondary/80 max-w-[250px] justify-between font-normal"
              >
                <div className="hidden md:inline">
                  {module.teacherIds.length > 0
                    ? `${module.teacherIds.length} teacher(s) selected`
                    : "Select teachers..."}
                </div>
                <div className="inline-flex items-center *:gap-1 md:hidden">
                  <Users />
                  {module.teacherIds.length}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[250px] bg-transparent p-0">
              <Command>
                <CommandInput placeholder="Search teachers..." />
                <CommandList>
                  <CommandEmpty>No teacher found.</CommandEmpty>
                  <CommandGroup>
                    {allTeachers.map((teacher) => {
                      const isSelected = module.teacherIds.includes(teacher.id);
                      return (
                        <CommandItem
                          key={teacher.id}
                          value={teacher.name}
                          onSelect={() => toggleTeacher(teacher.id)}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                          />
                          {teacher.image && (
                            <img
                              src={teacher.image}
                              alt={teacher.name}
                              className="mr-2 size-6 rounded-full"
                            />
                          )}
                          {teacher.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-md bg-red-600/10 text-red-600 transition-colors hover:bg-red-600 hover:text-white ${module.enrollments.length > 0 && "opacity-20"}`}
            onClick={deleteModule}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <label className="text-secondary/40 block">Module Description</label>
      <textarea
        value={module.description}
        placeholder="Enter module description..."
        required={true}
        onChange={(e) => handleModuleFieldChange("description", e.target.value)}
        className="w-full rounded-lg border p-2 text-secondary placeholder:text-secondary/40 focus:ring-primary border-slate-300"
      />

      <div
        className={`grid grid-cols-2 gap-2 md:grid-cols-4 items-start p-1 rounded-lg transition-colors ${module.variants.length === 0 && "bg-red-600/20"}`}
      >
        {Object.values(ModuleVariantType).map((type) => (
          <VariantCardlet
            key={type}
            type={type}
            variant={module.variants.find((v) => v.variantType === type)}
            setCourse={setCourse}
            moduleIndex={module.index}
          />
        ))}
      </div>
    </div>
  );
}

function VariantCardlet({
  type,
  variant,
  setCourse,
  moduleIndex,
}: {
  type: ModuleVariantType;
  variant?: EditableVariant;
  setCourse: Dispatch<SetStateAction<EditableCourse>>;
  moduleIndex: number;
}) {
  const toggleVariant = (type: ModuleVariantType) => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        const targetModule = draft.modules[moduleIndex / 10];
        const isSelected = targetModule.variants.some((variant) => variant.variantType === type);
        if (isSelected) {
          targetModule.variants = targetModule.variants.filter(
            (variant) => variant.variantType !== type
          );
        } else {
          targetModule.variants.push({
            variantType: type,
            price: 0,
          });
        }
      })
    );
  };

  const handlePriceChange = (type: ModuleVariantType, price: number) => {
    setCourse((prev) =>
      produce(prev, (draft) => {
        draft.modules[moduleIndex / 10].variants.find(
          (variant) => variant.variantType === type
        )!.price = price;
      })
    );
  };

  return (
    <div
      className={`${variant ? "bg-primary" : "bg-secondary"} hover:saturate-150 hover:scale-103 hover:shadow-lg space-y-2 p-2 transition-all text-white rounded-md`}
      onClick={() => toggleVariant(type)}
    >
      <span className="pointer-events-none block text-xs opacity-50 tracking-widest uppercase text-center">
        {variant ? "enabled" : "disabled"}
      </span>
      <span className="pointer-events-none block">
        <ModuleVariantTypeBadge type={type} />
      </span>
      {variant && (
        <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
          <label>EGP</label>
          <input
            className="px-1 rounded-md w-full bg-white text-secondary"
            type="number"
            value={variant.price.toString()}
            onChange={(e) => {
              const asNumber =
                e.target.value === "" || e.target.value === "0" ? 0 : Number(e.target.value);
              if (!Number.isNaN(asNumber)) handlePriceChange(type, asNumber);
            }}
          ></input>
        </div>
      )}
    </div>
  );
}
