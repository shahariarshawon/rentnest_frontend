"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchMyRentalRequests } from "@/services/rental.service";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText,
  Clock,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Compass,
  AlertCircle,
  Calendar,
  Building2,
  CreditCard,
} from "lucide-react";

export default function TenantDashboardOverviewPage() {
  const { user } = useAuthStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tenant-rental-requests"],
    queryFn: () => fetchMyRentalRequests(),
  });

  const requests = data?.requests || [];

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const activeRentals = requests.filter((r) => r.status === "ACTIVE").length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Welcome back, {user?.name || "Tenant"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Manage your rental applications, lease status, and payments in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Compass className="h-4 w-4" />
              Explore Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Requests */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Requests
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalRequests}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Submitted by you</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Pending
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingRequests}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Awaiting landlord decision</p>
          </div>
        </div>

        {/* Approved Requests */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Approved
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {approvedRequests}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Ready for payment</p>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Active Rentals
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <KeyRound className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeRentals}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Current active leases</p>
          </div>
        </div>
      </div>

      {/* Recent Rental Activity Section */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Recent Rental Activity
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Latest applications and status updates
            </p>
          </div>
          <Link
            href="/dashboard/tenant/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load rental requests: {(error as Error)?.message}</span>
              </div>
              <button
                onClick={() => refetch()}
                className="font-semibold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No rental requests yet
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Browse available properties and send your first rental application.
              </p>
              <Link
                href="/properties"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Compass className="h-4 w-4" />
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between gap-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      {req.property?.images && req.property.images.length > 0 ? (
                        <Image
                          src={req.property.images[0]}
                          alt={req.property.title}
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
                    <div>
                      <Link
                        href={`/dashboard/tenant/requests/${req.id}`}
                        className="text-xs font-bold text-neutral-900 transition hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400"
                      >
                        {req.property?.title || "Property"}
                      </Link>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          ৳{Number(req.property?.monthlyRent ?? req.rentalAmount ?? 0).toLocaleString()}/mo
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Move-in: {new Date(req.moveInDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>Duration: {req.leaseDurationMonths ?? req.leaseDuration ?? 12} mos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={req.status} />
                    {req.status === "APPROVED" && (
                      <Link
                        href={`/dashboard/tenant/requests/${req.id}/pay`}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        <CreditCard className="h-3 w-3" />
                        Pay Now
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/tenant/requests/${req.id}`}
                      className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
