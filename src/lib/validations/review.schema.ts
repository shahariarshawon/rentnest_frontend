import { z } from "zod";

export const createReviewSchema = z.object({
  rentalRequestId: z.string().uuid("Please select a completed rental"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().trim().max(1000, "Review cannot exceed 1000 characters").optional(),
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;

export const reviewFormSchema = createReviewSchema;
export type ReviewFormValues = CreateReviewFormData;
