import Link from "next/link";
import { Building2, Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                RentNest
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Modern rental property marketplace connecting tenants and landlords with verified listings, digital workflows, and seamless payment processing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?category=apartment" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?category=house" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Houses & Duplexes
                </Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Account
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/auth/login" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Tenant Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=LANDLORD" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Landlord Sign Up
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=TENANT" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Tenant Registration
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Contact & Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>support@rentnest.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200/80 pt-6 dark:border-neutral-800">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-neutral-500 sm:flex-row">
            <p>© 2026 RentNest. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for NextLevel Web Assignment
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
