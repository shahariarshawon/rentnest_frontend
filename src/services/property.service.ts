import { apiClient } from "@/lib/api-client";
import type {
  Category,
  Property,
  PropertyFilterParams,
} from "@/types/property";
import type { PaginationMeta } from "@/types/api";

export interface PropertiesResponse {
  properties: Property[];
  pagination: PaginationMeta;
}

export async function fetchProperties(
  params?: PropertyFilterParams,
): Promise<PropertiesResponse> {
  const queryParams: Record<string, string | number | boolean | undefined | null> = {};

  if (params) {
    if (params.search) queryParams.search = params.search;
    if (params.city) queryParams.city = params.city;
    if (params.area) queryParams.area = params.area;
    if (params.category) queryParams.category = params.category;
    if (params.minPrice !== undefined && params.minPrice > 0)
      queryParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined && params.maxPrice > 0)
      queryParams.maxPrice = params.maxPrice;
    if (params.bedrooms !== undefined && params.bedrooms >= 0)
      queryParams.bedrooms = params.bedrooms;
    if (params.bathrooms !== undefined && params.bathrooms >= 0)
      queryParams.bathrooms = params.bathrooms;
    if (params.amenities) queryParams.amenities = params.amenities;
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
  }

  const res = await apiClient.get<PropertiesResponse>("/api/properties", {
    params: queryParams,
  });
  return res.data;
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const res = await apiClient.get<Property>(`/api/properties/${id}`);
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>("/api/categories");
  return res.data;
}
