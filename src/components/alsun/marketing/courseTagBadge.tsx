import { CourseTag, CourseTagType } from "@/generated/prisma/browser";
import { Info, Languages, LibraryBig, Puzzle, Sparkles } from "lucide-react";

export const CourseTagStyles = {
  [CourseTagType.Language]: {
    icon: Languages,
    color: "text-blue-700 ring-blue-300 bg-blue-50",
    activeColor: "bg-blue-700 text-blue-100",
  },
  [CourseTagType.Category]: {
    icon: LibraryBig,
    color: "text-purple-700 ring-purple-300 bg-purple-50",
    activeColor: "bg-purple-700 text-purple-100",
  },
  [CourseTagType.Framework]: {
    icon: Puzzle,
    color: "text-orange-700 ring-orange-300 bg-orange-50",
    activeColor: "bg-orange-700 text-orange-100",
  },
  [CourseTagType.Special]: {
    icon: Sparkles,
    color: "text-pink-700 ring-pink-300 bg-pink-50",
    activeColor: "bg-pink-700 text-pink-100",
  },
} as const;

const defaultStyle = {
  icon: Info,
  color: "text-secondary ring-slate-300 bg-slate-50",
  activeColor: "bg-secondary text-slate-100",
};

export function CourseTagBadge({ tag, active = false }: { tag: CourseTag; active?: boolean }) {
  const style = CourseTagStyles[tag.type] ?? defaultStyle;
  const { icon: Icon } = style;

  const color = active ? style.activeColor : style.color;
  const ring = active ? "" : "ring-1";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${ring} ${color}`}
    >
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {tag.name}
    </span>
  );
}
