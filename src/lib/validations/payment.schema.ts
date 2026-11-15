import { z } from "zod";

export const paymentInitiationSchema = z.object({
  customerPhone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number cannot exceed 20 digits"),
  customerAddress: z
    .string()
    .trim()
    .min(3, "Billing address must be at least 3 characters")
    .max(50, "Billing address cannot exceed 50 characters"),
  customerCity: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(50, "City cannot exceed 50 characters"),
  customerPostcode: z
    .string()
    .trim()
    .min(3, "Postal code is required")
    .max(30, "Postal code cannot exceed 30 characters"),
});

export type PaymentInitiationFormData = z.infer<
  typeof paymentInitiationSchema
>;

export const paymentFormSchema = paymentInitiationSchema;
export type PaymentFormValues = PaymentInitiationFormData;
