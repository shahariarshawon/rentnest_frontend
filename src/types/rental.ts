import type { RentalRequestStatus, PaginationMeta } from "./api";
import type { Property } from "./property";
import type { User } from "./auth";
import type { Payment } from "./payment";

export type { RentalRequestStatus };

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  message?: string | null;
  moveInDate: string;
  leaseDurationMonths?: number | null;
  leaseDuration?: number | null;
  rentalAmount?: number | null;
  status: RentalRequestStatus;
  landlordResponse?: string | null;
  decidedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  property: Property;
  tenant?: Pick<User, "id" | "name" | "email" | "phone">;
  payments?: Payment[];
}

export interface RentalRequestsResponse {
  requests: RentalRequest[];
  pagination: PaginationMeta;
}

export interface CreateRentalRequestInput {
  propertyId: string;
  moveInDate: string;
  leaseDurationMonths?: number;
  message?: string;
}

export interface LandlordDecisionInput {
  status: "APPROVED" | "REJECTED";
  landlordResponse?: string;
}
