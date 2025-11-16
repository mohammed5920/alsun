import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

function needsAuth(url: string) {
  return (
    url.startsWith("/admin") ||
    url.startsWith("/teach") ||
    url.startsWith("/learn") ||
    url.startsWith("/settings") ||
    url.startsWith("/checkout")
  );
}

function needsUnauth(url: string) {
  return url.startsWith("/login") || url.startsWith("/signup");
}

export function proxy(request: NextRequest) {
  const isAuthed = !!getSessionCookie(request);
  if (isAuthed && needsUnauth(request.nextUrl.pathname)) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/learn";
    const absUrl = request.nextUrl.clone();
    absUrl.pathname = redirect;
    absUrl.searchParams.delete("redirect");
    return NextResponse.redirect(absUrl);
  }
  if (!isAuthed && needsAuth(request.nextUrl.pathname)) {
    const absUrl = request.nextUrl.clone();
    absUrl.pathname = "/login";
    absUrl.searchParams.append("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(absUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
