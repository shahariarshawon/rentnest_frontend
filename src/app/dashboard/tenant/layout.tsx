"use client";

import { ReactNode } from "react";
import { LayoutDashboard, FileText, CreditCard, Star, Search, ShieldCheck } from "lucide-react";
import { DashboardSidebar, DashboardNavItem } from "@/components/dashboard-sidebar";
import { useAuthStore } from "@/hooks/use-auth";

const tenantNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
  { label: "Rental Requests", href: "/dashboard/tenant/requests", icon: FileText },
  { label: "Payment History", href: "/dashboard/tenant/payments", icon: CreditCard },
  { label: "My Reviews", href: "/dashboard/tenant/reviews", icon: Star },
  { label: "Browse Properties", href: "/properties", icon: Search },
];

export default function TenantDashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-16 pt-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                <ShieldCheck className="h-3 w-3" />
                TENANT
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Logged in as {user?.email || "tenant"}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Tenant Portal
            </h1>
          </div>
          <div className="text-xs text-neutral-500">
            RentNest Secure Rental Ecosystem
          </div>
        </div>

        {/* Layout with Sidebar + Main Content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <DashboardSidebar
            title="Tenant Menu"
            subtitle={user?.name || "Tenant Account"}
            items={tenantNavItems}
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
