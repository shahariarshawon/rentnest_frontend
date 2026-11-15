"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPropertyById } from "@/services/property.service";
import { updateLandlordProperty } from "@/services/landlord-property.service";
import { LandlordPropertyForm } from "@/components/landlord-property-form";
import { LandlordPropertyFormData } from "@/lib/validations/property.schema";
import { ArrowLeft, Edit3, ShieldAlert } from "lucide-react";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: property,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["property-details", id],
    queryFn: () => fetchPropertyById(id),
  });

  const mutation = useMutation({
    mutationFn: (data: LandlordPropertyFormData) => {
      const images = data.imageUrls
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      return updateLandlordProperty(id, {
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
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      queryClient.invalidateQueries({ queryKey: ["property-details", id] });
      router.push("/dashboard/landlord/properties");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to update property";
      toast.error(msg);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: LandlordPropertyFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-neutral-900" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
          Property Not Found or Unauthorized
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          {(error as Error)?.message || "You may only edit listings that you own."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Retry
          </button>
          <Link
            href="/dashboard/landlord/properties"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

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
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Edit Property Listing
            </h2>
            <p className="text-xs text-neutral-500">
              Update pricing, specifications, or amenities for &ldquo;{property.title}&rdquo;.
            </p>
          </div>
        </div>
      </div>

      <LandlordPropertyForm
        key={property.id}
        initialData={property}
        isEditing={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
