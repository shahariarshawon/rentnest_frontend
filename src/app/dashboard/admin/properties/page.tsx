"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminProperties } from "@/services/admin.service";
import { StatusBadge } from "@/components/status-badge";
import { PropertyStatus } from "@/types/property";
import {
  Building2,
  Search,
  RefreshCw,
  ExternalLink,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-properties", search, statusFilter, page],
    queryFn: () =>
      fetchAdminProperties({
        search: search.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        limit: 10,
      }),
  });

  const properties = data?.properties || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Property Listings Moderation
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Global repository of all rental listings across landlords on RentNest.
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

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative sm:col-span-8">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search listings by title, address, or description..."
            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PropertyStatus | "ALL");
              setPage(1);
            }}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="ALL">All Listing Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented / Occupied</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Properties List */}
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
              Failed to load properties
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {properties.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/60 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-neutral-800/30"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {p.images && p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="80px"
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
                        href={`/properties/${p.id}`}
                        target="_blank"
                        className="text-sm font-bold text-neutral-900 hover:text-purple-600 dark:text-neutral-100 dark:hover:text-purple-400 inline-flex items-center gap-1"
                      >
                        <span>{p.title}</span>
                        <ExternalLink className="h-3 w-3 text-neutral-400" />
                      </Link>
                      <StatusBadge status={p.status} />
                    </div>

                    <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                      <span>
                        {p.address}, {p.city}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        ৳{Number(p.monthlyRent).toLocaleString()}/mo
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <User className="h-3 w-3" />
                        Landlord: {p.landlord?.name || "Verified Landlord"} ({p.landlord?.email})
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500">{p.category?.name || "Apartment"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/properties/${p.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    <span>View Public Listing</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 text-xs text-neutral-500 dark:border-neutral-800">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} listings)
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
