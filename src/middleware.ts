import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session-cookie";
import { decodeSession } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decodeSession(token) : null;
  const { pathname } = request.nextUrl;

  if (token && !session) {
    const response = pathname.startsWith("/dashboard")
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "DOCTOR") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("notice", "student-workspace");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  if ((pathname === "/login" || pathname === "/register") && session) {
    if (session.role === "DOCTOR") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("notice", "student-workspace");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
