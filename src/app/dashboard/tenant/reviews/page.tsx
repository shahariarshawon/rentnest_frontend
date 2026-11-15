"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fetchMyRentalRequests } from "@/services/rental.service";
import { createReview } from "@/services/review.service";
import { reviewFormSchema, ReviewFormValues } from "@/lib/validations/review.schema";
import {
  Star,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function TenantReviewsPage() {
  const queryClient = useQueryClient();
  const [selectedRentalId, setSelectedRentalId] = useState<string>("");
  const [currentRating, setCurrentRating] = useState<number>(5);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenant-rental-requests"],
    queryFn: () => fetchMyRentalRequests(),
  });

  const requests = data?.requests || [];

  const completedRentals = requests.filter((r) => r.status === "COMPLETED");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rentalRequestId: "",
      rating: 5,
      comment: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ReviewFormValues) => createReview(values),
    onSuccess: () => {
      toast.success("Thank you! Your review has been submitted successfully.");
      reset({ rentalRequestId: "", rating: 5, comment: "" });
      setSelectedRentalId("");
      setCurrentRating(5);
      queryClient.invalidateQueries({ queryKey: ["tenant-rental-requests"] });
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to submit review";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    mutation.mutate(values);
  };

  const handleSelectRental = (id: string) => {
    setSelectedRentalId(id);
    setValue("rentalRequestId", id, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Property & Tenancy Reviews
        </h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Share verified feedback on completed rental stays to help other tenants make informed decisions.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-neutral-900" />
      ) : isError ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Failed to load rental records
          </p>
          <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
        </div>
      ) : completedRentals.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/60">
            <Star className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
            No Completed Rentals Eligible for Review
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            In accordance with platform trust and safety rules, reviews are only permitted for rentals that have completed their active lease cycle.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/dashboard/tenant/requests"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              View My Active Rentals
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Select Completed Stay */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                1. Select Completed Tenancy ({completedRentals.length})
              </h3>

              <div className="mt-3 space-y-2">
                {completedRentals.map((r) => {
                  const isSelected = selectedRentalId === r.id;
                  const prop = r.property;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRental(r.id)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl p-3 border transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40"
                          : "border-neutral-200/80 hover:border-neutral-300 dark:border-neutral-800"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        {prop?.images && prop.images.length > 0 ? (
                          <Image
                            src={prop.images[0]}
                            alt={prop.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {prop?.title || "Property"}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {prop?.city} • ৳{Number(prop?.monthlyRent ?? r.rentalAmount ?? 0).toLocaleString()}/mo
                        </p>
                        <span className="mt-0.5 inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Completed Tenancy
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Review Submission Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                2. Write Your Review
              </h3>

              {!selectedRentalId ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  Please select one of your completed rentals on the left to write a review.
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
                  <input type="hidden" {...register("rentalRequestId")} />

                  {/* Rating Stars Input */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Overall Rating (1 to 5 Stars) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setValue("rating", star, { shouldValidate: true });
                            setCurrentRating(star);
                          }}
                          className="p-1 transition hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= currentRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-300 dark:text-neutral-700"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {currentRating} / 5
                      </span>
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-[11px] text-red-600">
                        {errors.rating.message}
                      </p>
                    )}
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Your Comments & Experience (Optional)
                    </label>
                    <textarea
                      rows={4}
                      {...register("comment")}
                      placeholder="Share details about the property, location, landlord responsiveness, and overall living experience..."
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                    {errors.comment && (
                      <p className="mt-1 text-[11px] text-red-600">
                        {errors.comment.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
