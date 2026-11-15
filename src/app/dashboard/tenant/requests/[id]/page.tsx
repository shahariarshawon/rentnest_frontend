"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchRentalRequestById } from "@/services/rental.service";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  ShieldAlert,
  User,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink,
} from "lucide-react";

export default function TenantRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tenant-rental-request", id],
    queryFn: () => fetchRentalRequestById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-neutral-900" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
          Rental Request Not Found
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          {(error as Error)?.message || "The requested application could not be loaded."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
          >
            Retry
          </button>
          <Link
            href="/dashboard/tenant/requests"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  const { property } = request;

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link
          href="/dashboard/tenant/requests"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Requests</span>
        </Link>

        <div className="flex items-center gap-3">
          <StatusBadge status={request.status} />
          {request.status === "APPROVED" && (
            <Link
              href={`/dashboard/tenant/requests/${request.id}/pay`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <CreditCard className="h-4 w-4" />
              Proceed to Payment
            </Link>
          )}
          {request.status === "COMPLETED" && (
            <Link
              href="/dashboard/tenant/reviews"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
            >
              <Star className="h-4 w-4" />
              Write Review
            </Link>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 p-6 dark:border-neutral-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Property Image */}
            <div className="relative h-44 w-full md:w-56 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
              {property?.images && property.images.length > 0 ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 224px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <Building2 className="h-10 w-10" />
                </div>
              )}
            </div>

            {/* Property Specs */}
            <div className="flex-1 space-y-2">
              <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {property?.category?.name || "Property"}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {property?.title || "Rental Property"}
              </h2>
              {property?.address && (
                <p className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {property.address}, {property.city}
                  </span>
                </p>
              )}
              <div className="pt-2">
                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                  ৳{Number(property?.monthlyRent ?? request.rentalAmount ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500"> / month</span>
              </div>
              {property?.id && (
                <div className="pt-1">
                  <Link
                    href={`/properties/${property.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    target="_blank"
                  >
                    <span>View Public Listing</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Details Grid */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Move-in Date
            </span>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <Calendar className="h-4 w-4 text-blue-600" />
              {new Date(request.moveInDate).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Lease Duration
            </span>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <Clock className="h-4 w-4 text-blue-600" />
              {request.leaseDurationMonths ?? request.leaseDuration ?? 12} Months
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Application Submitted
            </span>
            <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {new Date(request.createdAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </p>
          </div>

          {property?.landlord && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Landlord Information
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-500" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {property.landlord.name}
                  </span>
                </div>
                <div className="text-neutral-500">
                  Email: {property.landlord.email}
                </div>
                {property.landlord.phone && (
                  <div className="text-neutral-500">
                    Phone: {property.landlord.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tenant Message */}
          {request.message && (
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Your Note to Landlord
              </span>
              <p className="mt-1 rounded-xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                &ldquo;{request.message}&rdquo;
              </p>
            </div>
          )}

          {/* Landlord Response */}
          {request.landlordResponse && (
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Landlord Response
              </span>
              <p className="mt-1 rounded-xl bg-blue-50/60 p-3 text-xs leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                &ldquo;{request.landlordResponse}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Status Callout / Action banner */}
        <div className="p-6">
          {request.status === "PENDING" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <Clock className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold">Waiting for Landlord Review</p>
                <p className="mt-1">
                  The landlord has been notified of your rental application. Once they approve it, you will be able to proceed with SSLCommerz payment directly from this page.
                </p>
              </div>
            </div>
          )}

          {request.status === "APPROVED" && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 sm:flex-row sm:items-center dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-bold">Application Approved! Ready for Lease Payment</p>
                  <p className="mt-1">
                    Your request has been approved. Complete your secure online payment via SSLCommerz to activate your lease.
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/tenant/requests/${request.id}/pay`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4" />
                Proceed to Payment
              </Link>
            </div>
          )}

          {request.status === "ACTIVE" && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-bold">Active Rental Lease</p>
                <p className="mt-1">
                  Payment has been confirmed and your rental is currently active. When your tenancy finishes, the landlord will mark it complete, enabling you to leave a verified property review.
                </p>
              </div>
            </div>
          )}

          {request.status === "REJECTED" && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
              <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-bold">Application Not Approved</p>
                <p className="mt-1">
                  The landlord was unable to accept this rental request. You can explore other available listings on RentNest.
                </p>
              </div>
            </div>
          )}

          {request.status === "COMPLETED" && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-800 sm:flex-row sm:items-center dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-200">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-bold">Rental Completed</p>
                  <p className="mt-1">
                    Your tenancy has completed. Help future tenants by sharing your honest review.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/tenant/reviews"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
              >
                <Star className="h-3.5 w-3.5" />
                Leave a Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
