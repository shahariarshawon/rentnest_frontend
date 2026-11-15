import { apiClient } from "@/lib/api-client";
import type { Property } from "@/types/property";
import type { PaginationMeta } from "@/types/api";

export interface LandlordPropertiesResponse {
  properties: Property[];
  pagination: PaginationMeta;
}

export interface CreateLandlordPropertyInput {
  title: string;
  description: string;
  address: string;
  area?: string | null;
  city: string;
  country: string;
  monthlyRent: number;
  securityDeposit?: number | null;
  bedrooms: number;
  bathrooms: number;
  areaSqFt?: number | null;
  amenities: string[];
  images: string[];
  categoryId: string;
  availableFrom?: string | null;
}

export type UpdateLandlordPropertyInput = Partial<CreateLandlordPropertyInput>;

export async function fetchLandlordProperties(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<LandlordPropertiesResponse> {
  const res = await apiClient.get<LandlordPropertiesResponse>(
    "/api/landlord/properties",
    { params },
  );
  return res.data;
}

export async function createLandlordProperty(
  input: CreateLandlordPropertyInput,
): Promise<Property> {
  const res = await apiClient.post<Property>(
    "/api/landlord/properties",
    input,
  );
  return res.data;
}

export async function updateLandlordProperty(
  id: string,
  input: UpdateLandlordPropertyInput,
): Promise<Property> {
  const res = await apiClient.put<Property>(
    `/api/landlord/properties/${id}`,
    input,
  );
  return res.data;
}

export async function deleteLandlordProperty(id: string): Promise<null> {
  const res = await apiClient.delete<null>(`/api/landlord/properties/${id}`);
  return res.data;
}

export async function updateLandlordPropertyStatus(
  id: string,
  status: "AVAILABLE" | "UNAVAILABLE",
): Promise<Property> {
  const res = await apiClient.patch<Property>(
    `/api/landlord/properties/${id}/status`,
    { status },
  );
  return res.data;
}
