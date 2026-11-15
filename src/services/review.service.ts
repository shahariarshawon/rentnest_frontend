import { apiClient } from "@/lib/api-client";
import type {
  Review,
  ReviewsResponse,
  CreateReviewInput,
} from "@/types/review";

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const res = await apiClient.post<Review>("/api/reviews", input);
  return res.data;
}

export async function fetchPropertyReviews(
  propertyId: string,
  params?: { page?: number; limit?: number },
): Promise<ReviewsResponse> {
  const res = await apiClient.get<ReviewsResponse>(
    `/api/reviews/property/${propertyId}`,
    { params },
  );
  return res.data;
}
