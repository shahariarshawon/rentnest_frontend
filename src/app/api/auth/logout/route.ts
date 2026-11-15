import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("rentnest_token");
  cookieStore.delete("rentnest_role");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
}
