import { apiClient } from "@/lib/api-client";
import type {
  Payment,
  PaymentsResponse,
  CreatePaymentInput,
  CreatePaymentResponse,
} from "@/types/payment";

export async function createPaymentSession(
  input: CreatePaymentInput,
): Promise<CreatePaymentResponse> {
  const res = await apiClient.post<CreatePaymentResponse>(
    "/api/payments/create",
    input,
  );
  return res.data;
}

export async function fetchMyPayments(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaymentsResponse> {
  const res = await apiClient.get<PaymentsResponse>("/api/payments", {
    params,
  });
  return res.data;
}

export async function fetchPaymentById(id: string): Promise<Payment> {
  const res = await apiClient.get<Payment>(`/api/payments/${id}`);
  return res.data;
}
