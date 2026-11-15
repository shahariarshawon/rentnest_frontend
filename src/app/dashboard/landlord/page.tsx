"use client";

import Link from "next/link";
import { useAuthStore } from "@/hooks/use-auth";
import { Building, Compass, FileText, PlusCircle, ShieldCheck } from "lucide-react";

export default function LandlordDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Landlord Dashboard
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Welcome back, {user?.name || "Landlord"} ({user?.email})
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Role: LANDLORD
          </span>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
            <p className="font-semibold">Phase 3 Verification Milestone:</p>
            <p className="mt-1 text-blue-800 dark:text-blue-300">
              Your Landlord session is verified and securely authenticated with HttpOnly cookies. Property listing management, rental request approvals, and active rental completion tools will be wired up in later phases.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 opacity-75 dark:border-neutral-800 dark:bg-neutral-800/40">
              <PlusCircle className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Add New Property
                </p>
                <p className="text-[11px] text-neutral-500">Coming in Phase 5</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 opacity-75 dark:border-neutral-800 dark:bg-neutral-800/40">
              <FileText className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Manage Requests
                </p>
                <p className="text-[11px] text-neutral-500">Coming in Phase 4</p>
              </div>
            </div>

            <Link
              href="/properties"
              className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-neutral-800 dark:bg-neutral-800/40"
            >
              <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Public Marketplace
                </p>
                <p className="text-[11px] text-neutral-500">View public listings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
