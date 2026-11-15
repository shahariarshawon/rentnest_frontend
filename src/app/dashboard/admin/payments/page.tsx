"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminPayments } from "@/services/admin.service";
import { StatusBadge } from "@/components/status-badge";
import { PaymentStatus } from "@/types/payment";
import {
  RefreshCw,
  TrendingUp,
  Filter,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-payments", statusFilter, page],
    queryFn: () =>
      fetchAdminPayments({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        limit: 10,
      }),
  });

  const payments = data?.payments || [];
  const summary = data?.summary;
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Platform Financial & Revenue Monitor
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Real-time audit log of all online transactions processed via SSLCommerz.
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

      {/* Revenue KPI banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Total Verified Platform Revenue
              </span>
              <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                ৳{Number(summary?.totalCompletedRevenue ?? 0).toLocaleString()} BDT
              </p>
            </div>
          </div>
          <div className="text-xs text-neutral-500 sm:text-right">
            <span>Settled Server-to-Server via SSLCommerz Gateway</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-neutral-400 mr-1" />
        {(["ALL", "COMPLETED", "PENDING", "FAILED", "CANCELLED"] as (PaymentStatus | "ALL")[]).map(
          (status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-sm dark:bg-purple-600 dark:text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{status}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Failed to load payments
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No transactions found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Gateway Provider</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="transition hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      {p.transactionId || p.id.slice(0, 8)}
                    </td>

                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                      ৳{Number(p.amount).toLocaleString()} {p.currency}
                    </td>

                    <td className="px-6 py-4 font-medium text-neutral-600 dark:text-neutral-300">
                      {p.provider || "SSLCOMMERZ"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {p.method || "Online"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(p.paidAt || p.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 text-xs text-neutral-500 dark:border-neutral-800">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
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
