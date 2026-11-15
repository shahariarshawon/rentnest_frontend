"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id") || searchParams.get("transactionId");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <XCircle className="h-9 w-9" />
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          The payment process was stopped or cancelled by the user. No funds were debited.
        </p>

        {tranId && (
          <div className="mt-6 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-xs dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="text-neutral-500">Transaction Reference:</span>{" "}
            <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
              {tranId}
            </span>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-left text-xs leading-relaxed text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold">Your Application Remains Safe:</p>
              <p className="mt-0.5">
                Your approved rental request is still reserved for you. You can restart the payment whenever you are ready from your tenant requests dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/tenant/requests"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Return to Rental Requests</span>
          </Link>
          <Link
            href="/dashboard/tenant"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tenant Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-neutral-900" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
