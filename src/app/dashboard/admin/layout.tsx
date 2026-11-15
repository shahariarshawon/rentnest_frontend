"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  CreditCard,
  Compass,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { DashboardSidebar, DashboardNavItem } from "@/components/dashboard-sidebar";
import { useAuthStore } from "@/hooks/use-auth";
import { toast } from "sonner";

const adminNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Property Moderation", href: "/dashboard/admin/properties", icon: Building },
  { label: "Rental Moderation", href: "/dashboard/admin/requests", icon: FileText },
  { label: "Revenue Monitor", href: "/dashboard/admin/payments", icon: CreditCard },
  { label: "Public Listings", href: "/properties", icon: Compass },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Admin session terminated successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-16 pt-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300">
                <ShieldAlert className="h-3 w-3" />
                SYSTEM ADMINISTRATOR
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {user?.email || "admin@rentnest.com"}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Platform Administration
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Layout with Sidebar + Main Content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <DashboardSidebar
            title="Administration"
            subtitle={user?.name || "Super Admin"}
            items={adminNavItems}
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
