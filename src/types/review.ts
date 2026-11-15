import type { PaginationMeta } from "./api";
import type { Property } from "./property";
import type { User } from "./auth";

export interface Review {
  id: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: Pick<User, "id" | "name">;
  property?: Pick<Property, "id" | "title">;
}

export interface ReviewsResponse {
  reviews: Review[];
  summary: {
    averageRating: number;
    totalReviews: number;
  };
  pagination: PaginationMeta;
}

export interface CreateReviewInput {
  rentalRequestId: string;
  rating: number;
  comment?: string;
}
