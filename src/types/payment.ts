import type { PaymentStatus, PaymentProvider, PaginationMeta } from "./api";

export type { PaymentStatus, PaymentProvider };
import type { RentalRequest } from "./rental";

export interface Payment {
  id: string;
  rentalRequestId: string;
  transactionId?: string | null;
  gatewaySessionId?: string | null;
  gatewayUrl?: string | null;
  gatewayValidationId?: string | null;
  bankTransactionId?: string | null;
  amount: number | string;
  currency: string;
  method?: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: RentalRequest;
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: PaginationMeta;
}

export interface CreatePaymentInput {
  rentalRequestId: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostcode: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  transactionId: string;
  amount: string;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  checkoutUrl: string;
}
