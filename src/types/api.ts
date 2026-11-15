export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errorDetails?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails?: unknown;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  pagination: PaginationMeta;
  [key: string]: T[] | PaginationMeta;
}

export interface HealthResponse {
  timestamp: string;
}
