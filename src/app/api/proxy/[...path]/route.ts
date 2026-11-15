import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

async function forwardRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
) {
  try {
    const { path } = await paramsPromise;
    const cookieStore = await cookies();
    const token = cookieStore.get("rentnest_token")?.value;

    const subPath = path.join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${API_BASE_URL.replace(/\/+$/, "")}/api/${subPath}${search}`;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    headers.set("Accept", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let body: BodyInit | undefined = undefined;
    if (
      request.method !== "GET" &&
      request.method !== "HEAD" &&
      request.body
    ) {
      body = await request.arrayBuffer();
    }

    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseContentType = backendRes.headers.get("content-type");
    if (responseContentType && responseContentType.includes("application/json")) {
      const data = await backendRes.json();
      return NextResponse.json(data, {
        status: backendRes.status,
      });
    }

    const text = await backendRes.text();
    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "Content-Type": responseContentType || "text/plain",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to communicate with backend";
    return NextResponse.json(
      { success: false, message, errorDetails: null },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}
