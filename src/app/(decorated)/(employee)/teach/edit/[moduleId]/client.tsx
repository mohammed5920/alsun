"use client";

import { CourseHero } from "@/components/alsun/marketing/courseHero";
import { ModuleVariantTypeBadge } from "@/components/alsun/marketing/moduleVariantTypeBadge";
import { WithActionOnClick } from "@/components/alsun/withAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateModule } from "@/lib/actions/module";
import { ModuleUpdateSchema } from "@/lib/types/module";
import { Strip } from "@/lib/types/util";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Course,
  CourseTag,
  Module,
  ModuleContent,
  ModuleContentType,
  ModuleVariant,
  ModuleVariantType,
} from "@prisma/client";
import { produce } from "immer";
import { Book, FileText, Link, MessageCircle, PlusCircle, SaveIcon, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type EditableModule = Strip<Module> & {
  contents: ModuleContent[];
  variants: ModuleVariant[];
  course: Strip<Course> & { tags: CourseTag[] };
};

export default function ModuleEditor({ initialModule }: { initialModule: EditableModule }) {
  const [module, setModule] = useState(initialModule);

  return (
    <div className="animate-in fade-in transform-gpu duration-500">
      <CourseHero course={module.course} />
      <div className="animate-in fade-in container mx-auto my-4 transform-gpu space-y-4 duration-200">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-3">
            <div className="mb-2 flex flex-col items-center justify-between gap-2 md:flex-row">
              <div className="flex items-center gap-4">
                <Book className="text-secondary size-8" />
                <div>
                  <p className="text-secondary/50 text-sm">Editing Module</p>
                  <h2 className="font-alsun-serif text-secondary text-3xl">
                    {module.title || "Untitled Module"}
                  </h2>
                </div>
              </div>

              <WithActionOnClick
                beforeAction={() => {
                  const parsed = ModuleUpdateSchema.safeParse(module);
                  if (!parsed.success) toast.error(parsed.error.issues[0].message);
                  return parsed.success;
                }}
                action={() => updateModule(module)}
                onSuccess={() => toast.success(`Module updated successfully.`)}
              >
                <Button className="bg-primary hover:bg-teal-700">
                  <SaveIcon />
                  Save Changes
                </Button>
              </WithActionOnClick>
            </div>
            <ModuleContentCard module={module} setModule={setModule} />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <ModuleDescriptionCard module={module} setModule={setModule} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleDescriptionCard({
  module,
  setModule,
}: {
  module: EditableModule;
  setModule: Dispatch<SetStateAction<EditableModule>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary">Module Details</CardTitle>
        <CardDescription>Provide a clear and concise description for this module.</CardDescription>
      </CardHeader>
      <CardContent>
        <label htmlFor="description" className="text-secondary mt-3 block text-sm">
          Description
        </label>
        <textarea
          id="description"
          value={module.description}
          placeholder="Enter description..."
          rows={8}
          onChange={(e) => setModule((prev) => ({ ...prev, description: e.target.value }))}
          className="block w-full rounded-md border border-slate-300 p-2"
        />
      </CardContent>
    </Card>
  );
}

function ModuleContentCard({
  module,
  setModule,
}: {
  module: EditableModule;
  setModule: Dispatch<SetStateAction<EditableModule>>;
}) {
  const addContentItem = (type: ModuleContentType) => {
    setModule((prev) =>
      produce(prev, (draft) => {
        draft.contents.push({
          contentId: crypto.randomUUID(),
          contentType: type,
          title: "",
          url: "",
          moduleId: draft.moduleId,
          viewableBy: Object.values(ModuleVariantType),
        });
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary">Module Content</CardTitle>
        <CardDescription>
          Upload files, add video links, and manage resources for this module.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {module.contents.length === 0 && (
          <div className="text-secondary/50 rounded-lg border-2 border-dashed py-8 text-center">
            <p>No content has been added yet.</p>
            <p className="text-sm">Use the buttons below to add resources.</p>
          </div>
        )}

        {module.contents.map((item) => (
          <ContentItem key={item.contentId} item={item} setModule={setModule} />
        ))}

        <div className="flex flex-col flex-wrap gap-2 border-t pt-4 sm:flex-row">
          <Button variant="outline" className="grow" onClick={() => addContentItem("WHATSAPP")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Whatsapp Group
          </Button>
          <Button variant="outline" className="grow" onClick={() => addContentItem("FILE")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add File (PDF, etc.)
          </Button>
          <Button variant="outline" className="grow" onClick={() => addContentItem("LINK")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add External Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ContentItem({
  item,
  setModule,
}: {
  item: ModuleContent;
  setModule: Dispatch<SetStateAction<EditableModule>>;
}) {
  const handleItemChange = (field: "title" | "url", value: string) => {
    setModule((prev) =>
      produce(prev, (draft) => {
        draft.contents.find((c) => c.contentId === item.contentId)![field] = value;
      })
    );
  };

  const handleFileUploaded = (url: string, name: string) => {
    setModule((prev) =>
      produce(prev, (draft) => {
        const contentItem = draft.contents.find((c) => c.contentId === item.contentId)!;
        contentItem.url = url;
        if (!contentItem.title) {
          contentItem.title = name;
        }
      })
    );
  };

  const deleteItem = () => {
    setModule((prev) =>
      produce(prev, (draft) => {
        draft.contents = draft.contents.filter((c) => c.contentId !== item.contentId);
      })
    );
  };

  const getIcon = () => {
    switch (item.contentType) {
      case ModuleContentType.FILE:
        return <FileText className="text-secondary/60 size-5" />;
      case ModuleContentType.LINK:
        return <Link className="text-secondary/60 size-5" />;
      case ModuleContentType.WHATSAPP:
        return <MessageCircle className="text-secondary/60 size-5" />;
      default:
        return null;
    }
  };

  const handleViewableClick = (type: ModuleVariantType) => {
    setModule((prev) =>
      produce(prev, (draft) => {
        const cItem = draft.contents.find((c) => c.contentId === item.contentId)!;
        if (cItem.viewableBy.some((v) => v === type))
          cItem.viewableBy = cItem.viewableBy.filter((v) => v !== type);
        else cItem.viewableBy.push(type);
      })
    );
  };

  return (
    <div className="space-y-3 rounded-lg border-l-8 ring-1 ring-black/10 border-primary/10 bg-slate-50 p-4">
      <div className="flex grow items-center gap-3">
        {getIcon()}
        <Input
          placeholder="Enter title for this resource..."
          value={item.title}
          onChange={(e) => handleItemChange("title", e.target.value)}
          className="text-secondary placeholder:text-secondary/40 border-slate-300 text-base font-medium"
        />
        <Button
          variant="outline"
          size="icon"
          className="border border-red-600 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
          onClick={deleteItem}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {item.contentType === ModuleContentType.FILE &&
        (item.url ? (
          <div className="text-primary flex items-center gap-2 pl-8 text-sm">
            <FileText size={16} />
            File uploaded:{" "}
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline">
              {item.title || "View File"}
            </a>
          </div>
        ) : (
          <div className="pl-8">
            <UploadDropzone
              className="ut-label:text-sm ut-allowed-content:text-xs p-2!"
              appearance={{
                button: "bg-primary text-xs h-8",
                container: "bg-white border-slate-300",
              }}
              endpoint="mixedFileTypeUploader"
              onUploadBegin={() => toast.info("Uploading...")}
              onUploadError={(err) => {
                toast.error(`Upload failed: ${err.message}`);
              }}
              onClientUploadComplete={(res) => {
                handleFileUploaded(res[0].ufsUrl, res[0].name);
                toast.success("File uploaded successfully.");
              }}
            />
          </div>
        ))}

      {item.contentType === ModuleContentType.LINK && (
        <div className="flex items-center gap-3 pl-8">
          <Link className="text-secondary/40 size-5" />
          <Input
            placeholder="https://example.com/resource"
            value={item.url}
            onChange={(e) => handleItemChange("url", e.target.value)}
            className="text-secondary placeholder:text-secondary/40 border-slate-300"
          />
        </div>
      )}

      {item.contentType === ModuleContentType.WHATSAPP && (
        <div className="flex items-center gap-3 pl-8">
          <MessageCircle className="text-secondary/40 size-5" />
          <Input
            placeholder="Enter WhatsApp Group link or phone number..."
            value={item.url}
            onChange={(e) => handleItemChange("url", e.target.value)}
            className="text-secondary placeholder:text-secondary/40 border-slate-300"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {Object.values(ModuleVariantType).map((type) => {
          const active = item.viewableBy.some((v) => v === type);
          return (
            <div
              key={type}
              className={`${active ? "bg-primary" : "bg-secondary"} hover:saturate-150 hover:scale-103 hover:shadow-lg space-y-2 p-2 transition-all text-white rounded-md grow`}
              onClick={() => handleViewableClick(type)}
            >
              <span className="pointer-events-none block text-xs opacity-50 tracking-widest uppercase text-center">
                {active ? "shown to" : "hidden from"}
              </span>
              <span className="pointer-events-none">
                <ModuleVariantTypeBadge type={type} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
