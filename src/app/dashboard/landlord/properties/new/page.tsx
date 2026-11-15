"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createLandlordProperty } from "@/services/landlord-property.service";
import { LandlordPropertyForm } from "@/components/landlord-property-form";
import { LandlordPropertyFormData } from "@/lib/validations/property.schema";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: LandlordPropertyFormData) => {
      const images = data.imageUrls
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      return createLandlordProperty({
        title: data.title,
        description: data.description,
        address: data.address,
        area: data.area || undefined,
        city: data.city,
        country: data.country,
        monthlyRent: Number(data.monthlyRent),
        securityDeposit: data.securityDeposit ? Number(data.securityDeposit) : undefined,
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        areaSqFt: data.areaSqFt ? Number(data.areaSqFt) : undefined,
        categoryId: data.categoryId,
        availableFrom: data.availableFrom || undefined,
        amenities: data.amenities,
        images,
      });
    },
    onSuccess: () => {
      toast.success("Property listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      router.push("/dashboard/landlord/properties");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to create property";
      toast.error(msg);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: LandlordPropertyFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/landlord/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              List a New Rental Property
            </h2>
            <p className="text-xs text-neutral-500">
              Provide complete and accurate details to attract verified tenants.
            </p>
          </div>
        </div>
      </div>

      <LandlordPropertyForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
