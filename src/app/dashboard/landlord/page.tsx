"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchLandlordProperties } from "@/services/landlord-property.service";
import { fetchLandlordRentalRequests } from "@/services/rental.service";
import { StatusBadge } from "@/components/status-badge";
import {
  Building,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function LandlordDashboardOverviewPage() {
  const { user } = useAuthStore();

  const {
    data: propertyData,
    isLoading: loadingProperties,
  } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => fetchLandlordProperties(),
  });

  const {
    data: requestData,
    isLoading: loadingRequests,
    isError: requestError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["landlord-rental-requests"],
    queryFn: () => fetchLandlordRentalRequests(),
  });

  const properties = propertyData?.properties || [];
  const requests = requestData?.requests || [];

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === "AVAILABLE").length;
  const rentedProperties = properties.filter((p) => p.status === "RENTED").length;

  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const activeRentals = requests.filter((r) => r.status === "ACTIVE").length;

  // Real active monthly rent derived from active leases
  const activeMonthlyRent = requests
    .filter((r) => r.status === "ACTIVE")
    .reduce((sum, r) => sum + Number(r.property?.monthlyRent ?? r.rentalAmount ?? 0), 0);

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const isLoading = loadingProperties || loadingRequests;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Welcome back, {user?.name || "Landlord"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Manage your property portfolio, evaluate tenant applications, and monitor occupancy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/landlord/properties/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <PlusCircle className="h-4 w-4" />
              List New Property
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Properties */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              My Listings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalProperties}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">
              {availableProperties} Available • {rentedProperties} Rented
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Pending Requests
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
            <p className="mt-1 text-[11px] text-neutral-400">Awaiting your approval</p>
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
            <p className="mt-1 text-[11px] text-neutral-400">Awaiting tenant payment</p>
          </div>
        </div>

        {/* Active Occupancy Rent */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Active Leases
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
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
            <p className="mt-1 text-[11px] text-neutral-400">
              ৳{activeMonthlyRent.toLocaleString()}/mo total rent
            </p>
          </div>
        </div>
      </div>

      {/* Recent Incoming Requests */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Recent Incoming Rental Requests
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Tenant applications for your listings
            </p>
          </div>
          <Link
            href="/dashboard/landlord/requests"
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
          ) : requestError ? (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load incoming requests</span>
              </div>
              <button
                onClick={() => refetchRequests()}
                className="font-semibold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                <FileText className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No incoming rental requests yet
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Tenant applications will appear here when users apply for your listings.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between gap-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {req.tenant?.name?.charAt(0).toUpperCase() || "T"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {req.tenant?.name || "Tenant"}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          ({req.tenant?.email})
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        Property:{" "}
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {req.property?.title || "Listing"}
                        </span>{" "}
                        • ৳{Number(req.property?.monthlyRent ?? req.rentalAmount ?? 0).toLocaleString()}/mo
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-400">
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
                    <Link
                      href="/dashboard/landlord/requests"
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Manage
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
