import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route prefixes that require server-side authenticated sessions
const PROTECTED_PREFIXES = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const sessionCookie = request.cookies.get("studenthub_session");

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled directly by API handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
