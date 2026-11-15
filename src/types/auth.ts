import type { UserRole, UserStatus } from "./api";

export type { UserRole, UserStatus };

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  role: "TENANT" | "LANDLORD";
}

export interface LoginFormData {
  email: string;
  password: string;
}
