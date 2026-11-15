"use client";

import { useAuthStore } from "@/hooks/use-auth";
import { Shield, Users, Building, DollarSign, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                System Administration
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Logged in as {user?.name || "Administrator"} ({user?.email})
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            Role: ADMIN
          </span>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-xs leading-relaxed text-purple-900 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-200">
            <p className="font-semibold">Phase 3 Verification Milestone:</p>
            <p className="mt-1 text-purple-800 dark:text-purple-300">
              Administrative role protection is active. User moderation, category CRUD, system-wide property/rental inspection, and payment analytics will be implemented in later phases.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 opacity-75 dark:border-neutral-800 dark:bg-neutral-800/40">
              <Users className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  User Management
                </p>
                <p className="text-[11px] text-neutral-500">Coming in Phase 6</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 opacity-75 dark:border-neutral-800 dark:bg-neutral-800/40">
              <Building className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Category & Listings
                </p>
                <p className="text-[11px] text-neutral-500">Coming in Phase 6</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 opacity-75 dark:border-neutral-800 dark:bg-neutral-800/40">
              <DollarSign className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Revenue Analytics
                </p>
                <p className="text-[11px] text-neutral-500">Coming in Phase 6</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
