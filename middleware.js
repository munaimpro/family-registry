import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/member", "/signin", "/signup"];
  // Note: /api contains auth and could contain public api routes. 
  // /member/blood-group is a child route of member.
  const publicPrefixes = ["/api", "/_next", "/favicon.ico", "/member/blood-group", "/assets"];

  const isPublicRoute = publicPaths.includes(pathname) || publicPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
