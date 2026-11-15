import { apiClient } from "@/lib/api-client";
import type { HealthResponse } from "@/types/api";

export async function checkBackendHealth() {
  const response = await apiClient.get<HealthResponse>("/api/health");
  return response.data;
}
