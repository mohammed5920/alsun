import { ModuleVariantType } from "@/generated/prisma/browser";
import { Building, Laptop, User, Users } from "lucide-react";

export const VariantTagStyles = {
  [ModuleVariantType.GROUP_ONLINE]: (
    <>
      <Users className="size-4" />
      Group
      <Laptop className="size-4" />
      Online
    </>
  ),
  [ModuleVariantType.GROUP_ONSITE]: (
    <>
      <Users className="size-4" />
      Group
      <Building className="size-4" />
      In-Person
    </>
  ),
  [ModuleVariantType.PRIVATE_ONLINE]: (
    <>
      <User className="size-4" />
      Private
      <Laptop className="size-4" />
      Online
    </>
  ),
  [ModuleVariantType.PRIVATE_ONSITE]: (
    <>
      <User className="size-4" />
      Private
      <Building className="size-4" />
      In-Person
    </>
  ),
} as const;

export function ModuleVariantTypeBadge({
  type,
  singleRow,
}: {
  type: ModuleVariantType;
  singleRow?: boolean;
}) {
  const inner = VariantTagStyles[type];
  return (
    <div
      className={`${singleRow ? "flex" : "grid grid-rows-2 grid-cols-[auto_1fr]"}  gap-1 rounded-md p-1.5 text-xs font-semibold ring-1`}
    >
      {inner}
    </div>
  );
}
