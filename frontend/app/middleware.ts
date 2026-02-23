// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example assumes you store a JWT token in cookies after login
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // your JWT cookie

  const url = req.nextUrl.clone();

  // If not logged in, redirect to signin
  if (!token && url.pathname.startsWith("/recruiter")) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/recruiter/:path*"],
   // protect all recruiter routes
};