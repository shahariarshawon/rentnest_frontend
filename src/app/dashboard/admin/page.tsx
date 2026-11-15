"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/use-auth";
import {
  fetchAdminUsers,
  fetchAdminProperties,
  fetchAdminRentals,
  fetchAdminPayments,
} from "@/services/admin.service";
import { StatusBadge } from "@/components/status-badge";
import {
  Users,
  Building,
  FileText,
  UserCheck,
  ArrowRight,
  TrendingUp,
  KeyRound,
  Calendar,
} from "lucide-react";

export default function AdminDashboardOverviewPage() {
  const { user } = useAuthStore();

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users-summary"],
    queryFn: () => fetchAdminUsers({ limit: 100 }),
  });

  const { data: propertiesData, isLoading: loadingProperties } = useQuery({
    queryKey: ["admin-properties-summary"],
    queryFn: () => fetchAdminProperties({ limit: 100 }),
  });

  const { data: rentalsData, isLoading: loadingRentals } = useQuery({
    queryKey: ["admin-rentals-summary"],
    queryFn: () => fetchAdminRentals({ limit: 100 }),
  });

  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ["admin-payments-summary"],
    queryFn: () => fetchAdminPayments({ limit: 100 }),
  });

  const users = usersData?.users || [];
  const properties = propertiesData?.properties || [];
  const rentals = rentalsData?.rentals || [];

  const totalUsers = usersData?.pagination.total ?? users.length;
  const tenantsCount = users.filter((u) => u.role === "TENANT").length;
  const landlordsCount = users.filter((u) => u.role === "LANDLORD").length;

  const totalProperties = propertiesData?.pagination.total ?? properties.length;
  const availableProperties = properties.filter((p) => p.status === "AVAILABLE").length;
  const rentedProperties = properties.filter((p) => p.status === "RENTED").length;

  const totalRentals = rentalsData?.pagination.total ?? rentals.length;
  const pendingRentals = rentals.filter((r) => r.status === "PENDING").length;
  const activeRentals = rentals.filter((r) => r.status === "ACTIVE").length;

  const totalRevenue = paymentsData?.summary?.totalCompletedRevenue ?? 0;

  const recentRentals = rentals.slice(0, 5);

  const isLoading = loadingUsers || loadingProperties || loadingRentals || loadingPayments;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Welcome, {user?.name || "Administrator"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Real-time platform intelligence, user telemetry, and marketplace moderation metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Registered Users
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalUsers}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">
              {tenantsCount} Tenants • {landlordsCount} Landlords
            </p>
          </div>
        </div>

        {/* Total Properties */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Marketplace Listings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
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
              {availableProperties} Available • {rentedProperties} Occupied
            </p>
          </div>
        </div>

        {/* Total Rentals */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Rental Requests
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalRentals}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">
              {pendingRentals} Pending • {activeRentals} Active
            </p>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Processed Volume
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ৳{Number(totalRevenue).toLocaleString()}
              </p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Verified via SSLCommerz</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/admin/users"
          className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                User Directory
              </h4>
              <p className="text-[11px] text-neutral-500">Search, filter roles & ban controls</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400" />
        </Link>

        <Link
          href="/dashboard/admin/properties"
          className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Property Moderation
              </h4>
              <p className="text-[11px] text-neutral-500">Monitor all platform listings</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400" />
        </Link>

        <Link
          href="/dashboard/admin/requests"
          className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Rental Applications
              </h4>
              <p className="text-[11px] text-neutral-500">Global tenancy contract status</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400" />
        </Link>
      </div>

      {/* Recent Platform Activity */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Recent Rental Applications Across RentNest
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Latest tenancy transactions submitted across all landlords and tenants
            </p>
          </div>
          <Link
            href="/dashboard/admin/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
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
          ) : recentRentals.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No recent platform activity found.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recentRentals.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col justify-between gap-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {r.tenant?.name || "Tenant"}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        applied for {r.property?.title || "Property"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                      <span>Landlord: {r.property?.landlord?.name || "Landlord"}</span>
                      <span>•</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        ৳{Number(r.property?.monthlyRent ?? 0).toLocaleString()}/mo
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.status} />
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
