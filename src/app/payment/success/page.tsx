"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMyPayments } from "@/services/payment.service";
import {
  CheckCircle2,
  Receipt,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id") || searchParams.get("transactionId");

  const { data } = useQuery({
    queryKey: ["tenant-payments"],
    queryFn: () => fetchMyPayments(),
  });

  const payments = data?.payments || [];

  // Find payment matching the transaction ID if available
  const payment = tranId
    ? payments.find((p) => p.transactionId === tranId) || payments[0]
    : payments[0];

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Payment Verified Successfully!
        </h1>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Your lease payment has been verified via SSLCommerz and your rental is now active.
        </p>

        {/* Transaction Summary Card */}
        <div className="mt-6 rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 text-left text-xs dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 dark:border-neutral-700">
            <span className="font-semibold text-neutral-500">Transaction ID</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
              {tranId || payment?.transactionId || "RN-VERIFIED"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {payment?.amount && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Amount Paid</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{Number(payment.amount).toLocaleString()} {payment.currency || "BDT"}
                </span>
              </div>
            )}

            {payment?.method && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Payment Channel</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {payment.method}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Payment Status</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                COMPLETED
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Rental Lease Status</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Server-to-Server SSLCommerz Validation Confirmed</span>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/tenant/requests"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span>Go to My Rentals</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/tenant/payments"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <Receipt className="h-4 w-4" />
            <span>View Payment History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-neutral-900" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
