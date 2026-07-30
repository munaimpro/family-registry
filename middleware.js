import { NextResponse } from "next/server";

export function middleware() {
  // Allow access to all pages so all menus are accessible without forcing login
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
