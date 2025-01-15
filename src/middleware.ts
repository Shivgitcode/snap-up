// middleware.ts
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Export middleware config
export const config = {
  // Match only the dashboard routes that need protection
  matcher: ["/dashboard/:path*"],
};

export default async function middleware(request: NextRequest) {
  const session = await auth();

  // If user is not authenticated and trying to access dashboard
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
