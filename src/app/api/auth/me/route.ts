import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("rentnest_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated", data: null },
        { status: 401 },
      );
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok || !data.success) {
      // Clear invalid or expired cookies
      cookieStore.delete("rentnest_token");
      cookieStore.delete("rentnest_role");

      return NextResponse.json(
        {
          success: false,
          message: data.message || "Session expired",
          data: null,
        },
        { status: 401 },
      );
    }

    // Refresh role cookie to match current database state
    const isHttps = request.url.startsWith("https://");
    if (data.data?.role) {
      cookieStore.set("rentnest_role", data.data.role, {
        httpOnly: true,
        secure: isHttps,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Session authenticated",
      data: data.data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message, data: null },
      { status: 500 },
    );
  }
}
