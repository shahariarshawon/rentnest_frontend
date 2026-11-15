import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Login failed",
          errorDetails: data.errorDetails,
        },
        { status: backendResponse.status || 400 },
      );
    }

    const { user, accessToken } = data.data;

    // Set secure HttpOnly cookies (respects HTTPS vs HTTP for local testing)
    const isHttps = request.url.startsWith("https://");
    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    };

    cookieStore.set("rentnest_token", accessToken, cookieOptions);
    cookieStore.set("rentnest_role", user.role, cookieOptions);

    return NextResponse.json({
      success: true,
      message: data.message || "Login successful",
      data: {
        user,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
