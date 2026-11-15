import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rentnest_token")?.value;
  const role = request.cookies.get("rentnest_role")?.value?.toUpperCase();

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Authenticated users visiting login or register should be redirected to their dashboard
  if (isAuthRoute && token && role) {
    let target = "/dashboard/tenant";
    if (role === "LANDLORD") target = "/dashboard/landlord";
    else if (role === "ADMIN") target = "/dashboard/admin";

    return NextResponse.redirect(new URL(target, request.url));
  }

  // Dashboard route protection
  if (isDashboardRoute) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role boundary enforcement
    if (pathname.startsWith("/dashboard/tenant") && role !== "TENANT") {
      const target =
        role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/admin";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith("/dashboard/landlord") && role !== "LANDLORD") {
      const target =
        role === "TENANT" ? "/dashboard/tenant" : "/dashboard/admin";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      const target =
        role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/tenant";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
