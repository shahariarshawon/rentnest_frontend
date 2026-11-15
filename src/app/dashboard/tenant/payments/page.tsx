"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMyPayments } from "@/services/payment.service";
import { StatusBadge } from "@/components/status-badge";
import {
  Building2,
  AlertCircle,
  Receipt,
  RefreshCw,
} from "lucide-react";

export default function TenantPaymentsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tenant-payments"],
    queryFn: () => fetchMyPayments(),
  });

  const payments = data?.payments || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Payment History
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Verified online payment transactions processed via SSLCommerz.
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

      {/* Payment Table / Card View */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Unable to load payment history
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
              <Receipt className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              No payments recorded yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Once a landlord approves your rental application, complete the payment to activate your lease.
            </p>
            <Link
              href="/dashboard/tenant/requests"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              View My Requests
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Property</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {payments.map((p) => {
                  const prop = p.rentalRequest?.property;

                  return (
                    <tr
                      key={p.id}
                      className="transition hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.transactionId || p.id.slice(0, 8)}
                      </td>

                      <td className="px-6 py-4">
                        {prop ? (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                              {prop.images && prop.images.length > 0 ? (
                                <Image
                                  src={prop.images[0]}
                                  alt={prop.title}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                  <Building2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                                {prop.title}
                              </p>
                              <p className="text-[11px] text-neutral-400">
                                {prop.city}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-400">Rental Lease</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                        ৳{Number(p.amount).toLocaleString()} {p.currency}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {p.method || p.provider || "SSLCOMMERZ"}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
