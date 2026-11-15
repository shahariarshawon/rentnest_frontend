import { z } from "zod";

export const createRentalRequestFormSchema = z.object({
  moveInDate: z.string().min(1, "Move-in date is required").refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, {
    message: "Move-in date must be a future date",
  }),
  leaseDurationMonths: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 month")
    .max(120, "Duration cannot exceed 120 months")
    .optional(),
  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional(),
});

export type CreateRentalRequestFormData = z.infer<
  typeof createRentalRequestFormSchema
>;
