import { z } from "zod";

export const landlordPropertyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  area: z.string().trim().max(100).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  country: z.string().trim().min(2, "Country must be at least 2 characters"),
  monthlyRent: z
    .number()
    .positive("Monthly rent must be greater than zero"),
  securityDeposit: z.number().nonnegative().optional(),
  bedrooms: z.number().int().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.number().int().min(0, "Bathrooms cannot be negative"),
  areaSqFt: z.number().int().positive().optional(),
  categoryId: z.string().uuid("Please select a property category"),
  availableFrom: z.string().optional().or(z.literal("")),
  imageUrls: z.string().trim().min(1, "At least one image URL is required"),
  amenities: z.array(z.string()),
});

export type LandlordPropertyFormData = z.infer<
  typeof landlordPropertyFormSchema
>;
