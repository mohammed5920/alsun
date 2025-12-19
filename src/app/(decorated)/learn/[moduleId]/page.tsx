import { CourseHero } from "@/components/alsun/marketing/courseHero";
import { Button } from "@/components/ui/button";
import { ModuleContent, ModuleContentType } from "@/generated/prisma/browser";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { ChevronRight, FileText, Link, MessageCircle, PlayCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ModuleViewer({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;

  const user = await readUser();
  if (!user) redirect(`/login?redirect=/learn/${moduleId}`);

  const mod = await prisma.module.findFirst({
    where: { moduleId: moduleId },
    include: {
      course: { include: { tags: true } },
      contents: true,
      enrollments: {
        where: { studentId: user.id },
        select: { enrollmentId: true, variantType: true },
      },
    },
  });

  if (!mod) redirect("/learn");
  if (mod.enrollments.length === 0) redirect(`/courses/${mod.courseId}`);
  mod.contents = mod.contents.filter((content) =>
    content.viewableBy.some((v) => mod.enrollments[0].variantType === v)
  );

  return (
    <div className="animate-in fade-in transform-gpu duration-500">
      <CourseHero course={mod.course} />
      <div className="container mx-auto grid grid-cols-1 py-8 lg:grid-cols-12 lg:gap-12">
        <aside className="col-span-1 mx-6 h-fit lg:sticky lg:top-20 lg:col-span-4 lg:mx-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <nav className="space-y-2">
              <h3 className="text-secondary/60 text-sm font-semibold tracking-widest uppercase">
                Contents
              </h3>
              {mod.contents.map((item) => (
                <a
                  key={item.contentId}
                  href={`#${item.contentId}`}
                  className="text-secondary/70 bg-secondary/10 hover:bg-secondary flex items-center justify-between rounded-full p-2 px-4 transition-all hover:text-white"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <ChevronRight size={14} />
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="col-span-1 mx-6 mt-8 lg:col-span-8 lg:mx-0 lg:mt-0">
          <header className="mb-8">
            <h1 className="font-alsun-serif from-primary to-secondary hover:from-secondary hover:to-primary bg-linear-to-l bg-clip-text text-4xl leading-tight font-bold text-transparent transition-colors duration-500 lg:text-5xl">
              {mod.title}
            </h1>
            <p className="text-secondary/70 mt-4 max-w-3xl text-lg">{mod.description}</p>
          </header>

          <div className="space-y-6">
            {mod.contents.map((item) => (
              <ContentCard key={item.contentId} item={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function ContentCard({ item }: { item: ModuleContent }) {
  const getCardInfo = () => {
    switch (item.contentType) {
      case ModuleContentType.FILE:
        return {
          icon: FileText,
          buttonText: "Download File",
          actionType: "download",
        };
      case ModuleContentType.LINK:
        return {
          icon: PlayCircle,
          buttonText: "Open Resource",
          actionType: "link",
        };
      case ModuleContentType.WHATSAPP:
        return {
          icon: MessageCircle,
          buttonText: "Join Group",
          actionType: "link",
        };
      default:
        return { icon: Link, buttonText: "View", actionType: "link" };
    }
  };

  const { icon: Icon, buttonText, actionType } = getCardInfo();

  return (
    <div
      id={item.contentId}
      className="flex flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row"
    >
      <div className="shrink-0">
        <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full transition-colors">
          <Icon size={32} />
        </div>
      </div>
      <div className="grow text-center sm:text-left">
        <h3 className="text-secondary text-xl font-semibold">{item.title}</h3>
      </div>
      <div className="shrink-0">
        <Button
          asChild
          size="lg"
          className="group bg-primary w-full transition-all hover:bg-teal-700 sm:w-auto"
        >
          <a
            href={item.url}
            target={actionType === "link" ? "_blank" : undefined}
            download={actionType === "download" ? true : undefined}
            rel="noopener noreferrer"
          >
            {buttonText}
          </a>
        </Button>
      </div>
    </div>
  );
}
