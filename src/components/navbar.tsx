"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/hooks/use-auth";
import {
  Building2,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Home,
  Compass,
  FileText,
  Building,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  const role = user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              RentNest
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Property Rentals
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {role !== "ADMIN" && (
            <Link
              href="/properties"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <Compass className="h-4 w-4" />
              Properties
            </Link>
          )}

          {/* Role Specific Desktop Links */}
          {isAuthenticated && role === "TENANT" && (
            <>
              <Link
                href="/dashboard/tenant"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Link>
              <Link
                href="/dashboard/tenant#requests"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <FileText className="h-4 w-4" />
                My Requests
              </Link>
              <Link
                href="/dashboard/tenant#profile"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </>
          )}

          {isAuthenticated && role === "LANDLORD" && (
            <>
              <Link
                href="/dashboard/landlord"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Link>
              <Link
                href="/dashboard/landlord#properties"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <Building className="h-4 w-4" />
                My Properties
              </Link>
              <Link
                href="/dashboard/landlord#requests"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <FileText className="h-4 w-4" />
                Requests
              </Link>
              <Link
                href="/dashboard/landlord#profile"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </>
          )}

          {isAuthenticated && role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-red-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 pt-2 pb-6 md:hidden dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {role !== "ADMIN" && (
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Compass className="h-4 w-4" />
                Properties
              </Link>
            )}

            {/* Mobile Tenant Links */}
            {isAuthenticated && role === "TENANT" && (
              <>
                <Link
                  href="/dashboard/tenant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Dashboard
                </Link>
                <Link
                  href="/dashboard/tenant#requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <FileText className="h-4 w-4" />
                  My Requests
                </Link>
                <Link
                  href="/dashboard/tenant#profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}

            {/* Mobile Landlord Links */}
            {isAuthenticated && role === "LANDLORD" && (
              <>
                <Link
                  href="/dashboard/landlord"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Dashboard
                </Link>
                <Link
                  href="/dashboard/landlord#properties"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Building className="h-4 w-4" />
                  My Properties
                </Link>
                <Link
                  href="/dashboard/landlord#requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <FileText className="h-4 w-4" />
                  Requests
                </Link>
                <Link
                  href="/dashboard/landlord#profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}

            {/* Mobile Admin Links */}
            {isAuthenticated && role === "ADMIN" && (
              <Link
                href="/dashboard/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="my-2 border-t border-neutral-200 pt-2 dark:border-neutral-800">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-3 py-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
