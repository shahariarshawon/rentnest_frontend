import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password, and role are required",
        },
        { status: 400 },
      );
    }

    if (role !== "TENANT" && role !== "LANDLORD") {
      return NextResponse.json(
        { success: false, message: "Role must be either TENANT or LANDLORD" },
        { status: 400 },
      );
    }

    const payload: Record<string, string> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    if (phone && phone.trim()) {
      payload.phone = phone.trim();
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed",
          errorDetails: data.errorDetails,
        },
        { status: backendResponse.status || 400 },
      );
    }

    const { user, accessToken } = data.data;

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
      message: data.message || "Registration successful",
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
