"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMyRentalRequests } from "@/services/rental.service";
import { StatusBadge } from "@/components/status-badge";
import { RentalRequestStatus } from "@/types/rental";
import {
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  CreditCard,
  User,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";

const FILTER_TABS: { label: string; value: RentalRequestStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function TenantRequestsPage() {
  const [activeFilter, setActiveFilter] = useState<RentalRequestStatus | "ALL">("ALL");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tenant-rental-requests"],
    queryFn: () => fetchMyRentalRequests(),
  });

  const requests = data?.requests || [];

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === "ALL") return true;
    return r.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            My Rental Requests
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Track applications, approval decisions, and direct lease payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Search className="h-3.5 w-3.5" />
            Find New Place
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-neutral-400 mr-1" />
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === "ALL"
              ? requests.length
              : requests.filter((r) => r.status === tab.value).length;
          const isSelected = activeFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/25 text-white"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="divide-y divide-neutral-100 p-6 dark:divide-neutral-800 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Unable to load requests
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
              <FileText className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {activeFilter === "ALL"
                ? "No rental requests found"
                : `No ${activeFilter.toLowerCase()} requests`}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {activeFilter === "ALL"
                ? "You haven't submitted any rental requests yet."
                : "No rental requests match the selected status filter."}
            </p>
            {activeFilter === "ALL" && (
              <Link
                href="/properties"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Browse Listings
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/60 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-neutral-800/30"
              >
                {/* Property & Landlord Details */}
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {req.property?.images && req.property.images.length > 0 ? (
                      <Image
                        src={req.property.images[0]}
                        alt={req.property.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/tenant/requests/${req.id}`}
                        className="text-sm font-bold text-neutral-900 hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400"
                      >
                        {req.property?.title || "Property"}
                      </Link>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        ৳{Number(req.property?.monthlyRent ?? req.rentalAmount ?? 0).toLocaleString()}/month
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Move-in: {new Date(req.moveInDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{req.leaseDurationMonths ?? req.leaseDuration ?? 12} Months</span>
                    </div>

                    {req.property?.landlord && (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <User className="h-3 w-3" />
                        <span>Landlord: {req.property.landlord.name}</span>
                        {req.property.landlord.phone && (
                          <span className="text-neutral-400">
                            ({req.property.landlord.phone})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status === "APPROVED" && (
                    <Link
                      href={`/dashboard/tenant/requests/${req.id}/pay`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Proceed to Payment
                    </Link>
                  )}

                  <Link
                    href={`/dashboard/tenant/requests/${req.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
