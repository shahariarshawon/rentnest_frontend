import { apiClient } from "@/lib/api-client";
import type {
  RentalRequest,
  RentalRequestsResponse,
  CreateRentalRequestInput,
  LandlordDecisionInput,
} from "@/types/rental";

export async function createRentalRequest(
  input: CreateRentalRequestInput,
): Promise<RentalRequest> {
  const res = await apiClient.post<RentalRequest>("/api/rentals", input);
  return res.data;
}

export async function fetchMyRentalRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<RentalRequestsResponse> {
  const res = await apiClient.get<RentalRequestsResponse>("/api/rentals", {
    params,
  });
  return res.data;
}

export async function fetchRentalRequestById(
  id: string,
): Promise<RentalRequest> {
  const res = await apiClient.get<RentalRequest>(`/api/rentals/${id}`);
  return res.data;
}

export async function fetchLandlordRentalRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<RentalRequestsResponse> {
  const res = await apiClient.get<RentalRequestsResponse>(
    "/api/landlord/requests",
    { params },
  );
  return res.data;
}

export async function updateRentalRequestStatus(
  id: string,
  input: LandlordDecisionInput,
): Promise<RentalRequest> {
  const res = await apiClient.patch<RentalRequest>(
    `/api/landlord/requests/${id}`,
    input,
  );
  return res.data;
}

export async function completeRentalRequest(
  id: string,
): Promise<RentalRequest> {
  const res = await apiClient.patch<RentalRequest>(
    `/api/landlord/requests/${id}/complete`,
  );
  return res.data;
}
