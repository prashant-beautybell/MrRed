import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/about", "/privacy", "/terms", "/login", "/signup", "/api/auth"];
const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.SKIP_AUTH === "true") {
    const loggedOut = request.cookies.has(DEV_LOGGED_OUT_COOKIE);
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    const isLanding = pathname === "/";
    const isPublicPage =
      isLanding ||
      pathname === "/about" ||
      pathname === "/privacy" ||
      pathname === "/terms";

    if (loggedOut && (isAuthPage || isPublicPage)) {
      return NextResponse.next();
    }

    if (loggedOut) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|mrred-logo.png|mrred-mascot.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
