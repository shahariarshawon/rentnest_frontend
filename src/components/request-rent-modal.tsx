"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRentalRequestFormSchema,
  type CreateRentalRequestFormData,
} from "@/lib/validations/rental.schema";
import { createRentalRequest } from "@/services/rental.service";
import type { Property } from "@/types/property";
import {
  X,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  AlertCircle,
  Building,
} from "lucide-react";
import { toast } from "sonner";

interface RequestRentModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestRentModal({
  property,
  isOpen,
  onClose,
}: RequestRentModalProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // Default move-in date: either property.availableFrom or tomorrow
  const minDate = (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (property.availableFrom) {
      const avail = new Date(property.availableFrom);
      return avail > tomorrow ? avail.toISOString().split("T")[0] : tomorrow.toISOString().split("T")[0];
    }
    return tomorrow.toISOString().split("T")[0];
  })();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRentalRequestFormData>({
    resolver: zodResolver(createRentalRequestFormSchema),
    defaultValues: {
      moveInDate: minDate,
      leaseDurationMonths: 12,
      message: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateRentalRequestFormData) => {
    setServerError(null);
    try {
      // Backend expects an ISO datetime string
      const isoMoveInDate = new Date(data.moveInDate).toISOString();

      await createRentalRequest({
        propertyId: property.id,
        moveInDate: isoMoveInDate,
        leaseDurationMonths: data.leaseDurationMonths,
        message: data.message?.trim() || undefined,
      });

      toast.success(
        "Rental request submitted successfully! The landlord will review your request.",
      );
      reset();
      onClose();
      router.push("/dashboard/tenant/requests");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit rental request";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Apply to Rent Property
            </h2>
            <p className="line-clamp-1 text-xs text-neutral-500">
              {property.title}
            </p>
          </div>
        </div>

        {/* Property Mini Card */}
        <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-300">
          <div className="flex items-center justify-between font-semibold">
            <span>Monthly Rent:</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              ৳{Number(property.monthlyRent).toLocaleString("en-BD")}
            </span>
          </div>
          {property.securityDeposit && (
            <div className="mt-1 flex items-center justify-between text-neutral-500">
              <span>Security Deposit:</span>
              <span>
                ৳{Number(property.securityDeposit).toLocaleString("en-BD")}
              </span>
            </div>
          )}
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Request Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Move-In Date */}
            <div>
              <label
                htmlFor="moveInDate"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Desired Move-in Date
              </label>
              <div className="relative mt-1.5">
                <Calendar className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
                <input
                  id="moveInDate"
                  type="date"
                  min={minDate}
                  {...register("moveInDate")}
                  className={`w-full rounded-xl border py-2 pr-3 pl-9 text-xs text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                    errors.moveInDate
                      ? "border-red-500"
                      : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                  }`}
                />
              </div>
              {errors.moveInDate && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.moveInDate.message}
                </p>
              )}
            </div>

            {/* Lease Duration */}
            <div>
              <label
                htmlFor="leaseDurationMonths"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Lease Duration (Months)
              </label>
              <div className="relative mt-1.5">
                <Clock className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
                <input
                  id="leaseDurationMonths"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 12"
                  {...register("leaseDurationMonths", { valueAsNumber: true })}
                  className={`w-full rounded-xl border py-2 pr-3 pl-9 text-xs text-neutral-900 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                    errors.leaseDurationMonths
                      ? "border-red-500"
                      : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                  }`}
                />
              </div>
              {errors.leaseDurationMonths && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.leaseDurationMonths.message}
                </p>
              )}
            </div>
          </div>

          {/* Message to Landlord */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Message for Landlord{" "}
              <span className="text-[10px] font-normal text-neutral-400">
                (Optional)
              </span>
            </label>
            <div className="relative mt-1.5">
              <MessageSquare className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
              <textarea
                id="message"
                rows={3}
                placeholder="Introduce yourself or share details about your household..."
                {...register("message")}
                className="w-full rounded-xl border border-neutral-200 py-2 pr-3 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Rental Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
