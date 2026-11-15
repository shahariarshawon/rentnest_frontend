"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminRentals } from "@/services/admin.service";
import { StatusBadge } from "@/components/status-badge";
import { RentalRequestStatus } from "@/types/rental";
import {
  Filter,
  RefreshCw,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const FILTER_TABS: { label: string; value: RentalRequestStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminRentalsPage() {
  const [activeFilter, setActiveFilter] = useState<RentalRequestStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-rentals", activeFilter, page],
    queryFn: () =>
      fetchAdminRentals({
        status: activeFilter === "ALL" ? undefined : activeFilter,
        page,
        limit: 10,
      }),
  });

  const rentals = data?.rentals || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Platform Rental Applications
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Global monitoring of all tenancy applications, landlord decisions, and lease lifecycles.
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
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-neutral-400 mr-1" />
        {FILTER_TABS.map((tab) => {
          const isSelected = activeFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveFilter(tab.value);
                setPage(1);
              }}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-purple-600 text-white shadow-sm dark:bg-purple-600 dark:text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rentals List */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Failed to load rental requests
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No rental applications found matching the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rentals.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/60 lg:flex-row lg:items-center lg:justify-between dark:hover:bg-neutral-800/30"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      Tenant: {r.tenant?.name || "Applicant"}
                    </span>
                    <span className="text-xs text-neutral-400">({r.tenant?.email})</span>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Listing: {r.property?.title || "Property"}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ৳{Number(r.property?.monthlyRent ?? 0).toLocaleString()}/mo
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <User className="h-3 w-3" />
                      Landlord: {r.property?.landlord?.name} ({r.property?.landlord?.email})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Move-in: {new Date(r.moveInDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>Duration: {r.leaseDurationMonths ?? 12} Months</span>
                    <span>•</span>
                    <span>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  {r.message && (
                    <p className="rounded-xl bg-neutral-100/70 p-2 text-xs italic text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-300">
                      &ldquo;{r.message}&rdquo;
                    </p>
                  )}

                  {r.landlordResponse && (
                    <p className="rounded-xl bg-purple-50/70 p-2 text-xs text-purple-900 dark:bg-purple-950/40 dark:text-purple-200">
                      <span className="font-semibold">Landlord Response:</span> &ldquo;{r.landlordResponse}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  {r.property?.id && (
                    <Link
                      href={`/properties/${r.property.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      <span>View Listing</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 text-xs text-neutral-500 dark:border-neutral-800">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} applications)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
