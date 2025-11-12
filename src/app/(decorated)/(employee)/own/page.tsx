import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import OwnerChallenge, { ErrorCauser } from "./client";

export default async function OwnerPage() {
  const user = await readUser();
  if (!user) redirect("/login?redirect=/own");
  const currentOwner = await prisma.user.findFirst({ where: { roleLevel: 4 } });
  if (!currentOwner) return <OwnerChallenge />;
  if (currentOwner.id !== user.id) redirect("/mbm");

  const [
    firstCourseId,
    firstModuleId,
    firstUserId,
    firstEnrolledModuleId,
    firstPublicCourseId,
    firstEnrollableModuleIdAndVariantType,
  ] = await Promise.all([
    prisma.course.findFirst({ select: { courseId: true } }).then((c) => c?.courseId),
    prisma.module.findFirst({ select: { moduleId: true } }).then((m) => m?.moduleId),
    prisma.user.findFirst({ select: { id: true } }).then((u) => u?.id),
    prisma.module
      .findFirst({
        select: { moduleId: true },
        where: { enrollments: { some: { studentId: user.id } } },
      })
      .then((m) => m?.moduleId),
    prisma.course
      .findFirst({ where: { isPublic: true }, select: { courseId: true } })
      .then((c) => c?.courseId),
    prisma.module
      .findFirst({
        where: { enrollments: { none: { studentId: user.id } }, variants: { some: {} } },
        select: { moduleId: true, variants: { select: { variantType: true } } },
      })
      .then((r) =>
        r ? { moduleId: r.moduleId, variantType: r.variants[0].variantType } : undefined
      ),
  ]);

  const siteMap = {
    Owner: {
      Sitemap: "/own",
    },
    Admin: {
      "Course Editor": firstCourseId && `/administrate/courses/${firstCourseId}/edit`,
      "Course Dashboard": firstCourseId && `/administrate/courses/${firstCourseId}`,
      "User Overview": firstUserId && `/administrate/users/${firstUserId}`,
      "Users Overview": "/administrate/users",
      "Admin Dashboard": "/administrate",
    },
    Teacher: {
      "Module Editor": firstModuleId && `/teach/edit/${firstModuleId}`,
      "Teacher Dashboard": "/teach",
    },
    Student: {
      "Module Page": firstEnrolledModuleId && `/learn/${firstEnrolledModuleId}`,
      "Student Dashboard": "/learn",
      Settings: "/settings",
      Checkout:
        firstEnrollableModuleIdAndVariantType &&
        `/checkout?moduleId=${firstEnrollableModuleIdAndVariantType.moduleId}&type=${firstEnrollableModuleIdAndVariantType.variantType}`,
    },
    "Signed Out": {
      Landing: "/",
      "Course Search": "/courses",
      "Course Page": firstPublicCourseId && `/courses/${firstPublicCourseId}`,
      Contact: "/contact",
      FAQ: "/faq",
      "Privacy Policy": "/privacy",
      Terms: "/terms",
      MBM: "/mbm",
      Login: null,
      Signup: null,
    },
    Errors: {
      "404": "/404",
      Global: "/error",
    },
  };

  return (
    <div className="flex size-full items-center justify-center animate-in fade-in transform-gpu duration-500 py-20">
      <div className="p-4 rounded-2xl backdrop-blur-md shadow-md border border-white/20 bg-white/20 uppercase tracking-widest text-center space-y-2 max-w-lg mx-4">
        {Object.entries(siteMap).map((roleMap) => {
          const [role, map] = roleMap;
          return (
            <div key={role} className="bg-white rounded-2xl p-2 space-y-2">
              <p>{role}</p>
              <div className="flex flex-wrap gap-2 justify-center lowercase tracking-tighter">
                {Object.entries(map).map((pageUrl) => {
                  const [page, url] = pageUrl;
                  const link = (
                    <Link
                      key={page}
                      href={url || ""}
                      className={url ? "underline text-primary" : "cursor-default"}
                    >
                      {page}
                    </Link>
                  );
                  return url === "/error" ? <ErrorCauser key={"error"} /> : link;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
