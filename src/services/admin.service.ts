import { apiClient } from "@/lib/api-client";
import type {
  AdminUser,
  AdminUsersResponse,
  AdminPropertiesResponse,
  AdminRentalsResponse,
  AdminPaymentsResponse,
  AdminUserQueryParams,
  AdminPropertyQueryParams,
  AdminRentalQueryParams,
  AdminPaymentQueryParams,
} from "@/types/admin";
import type { Category } from "@/types/property";

export async function fetchAdminUsers(
  params?: AdminUserQueryParams,
): Promise<AdminUsersResponse> {
  const res = await apiClient.get<AdminUsersResponse>("/api/admin/users", {
    params: params as Record<string, string | number | boolean | null | undefined>,
  });
  return res.data;
}

export async function updateAdminUserStatus(
  id: string,
  status: "ACTIVE" | "BANNED",
): Promise<AdminUser> {
  const res = await apiClient.patch<AdminUser>(`/api/admin/users/${id}`, {
    status,
  });
  return res.data;
}

export async function fetchAdminProperties(
  params?: AdminPropertyQueryParams,
): Promise<AdminPropertiesResponse> {
  const res = await apiClient.get<AdminPropertiesResponse>(
    "/api/admin/properties",
    { params: params as Record<string, string | number | boolean | null | undefined> },
  );
  return res.data;
}

export async function fetchAdminRentals(
  params?: AdminRentalQueryParams,
): Promise<AdminRentalsResponse> {
  const res = await apiClient.get<AdminRentalsResponse>("/api/admin/rentals", {
    params: params as Record<string, string | number | boolean | null | undefined>,
  });
  return res.data;
}

export async function fetchAdminPayments(
  params?: AdminPaymentQueryParams,
): Promise<AdminPaymentsResponse> {
  const res = await apiClient.get<AdminPaymentsResponse>(
    "/api/admin/payments",
    { params: params as Record<string, string | number | boolean | null | undefined> },
  );
  return res.data;
}

export async function createAdminCategory(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<Category> {
  const res = await apiClient.post<Category>("/api/admin/categories", data);
  return res.data;
}

export async function updateAdminCategory(
  id: string,
  data: { name?: string; slug?: string; description?: string },
): Promise<Category> {
  const res = await apiClient.patch<Category>(
    `/api/admin/categories/${id}`,
    data,
  );
  return res.data;
}

export async function deleteAdminCategory(id: string): Promise<null> {
  const res = await apiClient.delete<null>(`/api/admin/categories/${id}`);
  return res.data;
}
