import type { PaginationMeta } from "./api";
import type { Property } from "./property";
import type { RentalRequest } from "./rental";
import type { Payment } from "./payment";
import type { UserRole } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: "ACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: PaginationMeta;
}

export interface AdminPropertiesResponse {
  properties: Property[];
  pagination: PaginationMeta;
}

export interface AdminRentalsResponse {
  rentals: RentalRequest[];
  pagination: PaginationMeta;
}

export interface AdminPaymentsResponse {
  payments: Payment[];
  summary: {
    totalCompletedRevenue: number;
  };
  pagination: PaginationMeta;
}

export interface AdminUserQueryParams {
  search?: string;
  role?: UserRole;
  status?: "ACTIVE" | "BANNED";
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface AdminPropertyQueryParams {
  search?: string;
  city?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface AdminRentalQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface AdminPaymentQueryParams {
  status?: string;
  provider?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}
