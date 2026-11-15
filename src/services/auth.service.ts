import type { User, LoginFormData, RegisterFormData } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function loginUser(
  payload: LoginFormData,
): Promise<{ user: User }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<{ user: User }> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data.data;
}

export async function registerUser(
  payload: RegisterFormData,
): Promise<{ user: User }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<{ user: User }> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }

  return data.data;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const data: ApiResponse<User> = await res.json();
    return data.success && data.data ? data.data : null;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}
