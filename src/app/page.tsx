import Link from "next/link";

export const dynamic = "force-dynamic";
import {
  fetchCategories,
  fetchProperties,
} from "@/services/property.service";
import { PropertyCard } from "@/components/property-card";
import {
  Search,
  Building,
  Home as HomeIcon,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const [categoriesData, propertiesData] = await Promise.allSettled([
    fetchCategories(),
    fetchProperties({ limit: 6 }),
  ]);

  const categories =
    categoriesData.status === "fulfilled" ? categoriesData.value : [];
  const properties =
    propertiesData.status === "fulfilled"
      ? propertiesData.value.properties
      : [];

  const categoryIcons: Record<string, typeof Building> = {
    apartment: Building,
    house: HomeIcon,
    studio: Sparkles,
    room: HomeIcon,
    villa: Building,
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white py-16 sm:py-24 dark:from-neutral-900/60 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(0,0,0,0))]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bangladesh&apos;s Modern Rental Property Marketplace</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-neutral-50">
              Find Your Next Home{" "}
              <span className="text-blue-600 dark:text-blue-500">
                With Confidence
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              Browse verified residential apartments, modern studios, executive
              rooms, and luxury villas across prime locations with transparent
              pricing.
            </p>

            {/* Quick Search Form */}
            <form
              action="/properties"
              method="GET"
              className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-lg shadow-blue-500/5 sm:flex sm:items-center sm:gap-2 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-neutral-500">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="City, area or landmark (e.g. Gulshan, Dhanmondi)"
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none dark:text-neutral-100"
                />
              </div>

              <div className="hidden h-8 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

              <div className="flex items-center gap-2 px-3 py-2 text-neutral-500">
                <select
                  name="category"
                  defaultValue=""
                  aria-label="Filter by property category"
                  className="bg-transparent text-sm font-medium text-neutral-700 focus:outline-none dark:text-neutral-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:mt-0 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Benefits */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Verified Landlords
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Direct Rental Applications
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Secure SSLCommerz Payment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Property Categories Section */}
      {categories.length > 0 && (
        <section className="border-t border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
                  Explore by Category
                </h2>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                  Select a category to browse tailored rental options.
                </p>
              </div>
              <Link
                href="/properties"
                className="hidden text-xs font-semibold text-blue-600 hover:text-blue-700 sm:flex sm:items-center sm:gap-1 dark:text-blue-400"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat.slug] || Building;
                return (
                  <Link
                    key={cat.id}
                    href={`/properties?category=${cat.slug}`}
                    className="group flex flex-col items-center rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4 text-center transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm transition-transform duration-200 group-hover:scale-110 dark:bg-neutral-800 dark:text-blue-400">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {cat._count?.properties ?? 0} listed
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Properties Section */}
      <section className="bg-neutral-50/60 py-16 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Verified Listings
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
                Featured Properties
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Explore real, currently available rental properties across prime
                neighborhoods.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Browse All Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <Building className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                No properties available right now
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Check back soon or explore our property categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Value Propositions Section */}
      <section className="border-t border-neutral-200/80 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
              Why Tenants & Landlords Choose RentNest
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Engineered to replace traditional broker friction with transparency
              and security.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                Verified Listings & Profiles
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Every property and landlord undergoes administrative oversight
                to safeguard tenants from fraudulent listings and phantom fees.
              </p>
            </div>

            <div className="flex flex-col items-start rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                Integrated SSLCommerz Gateway
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Secure rental payments with bKash, Nagad, and Visa/Mastercard.
                Instant automated receipts and payment records.
              </p>
            </div>

            <div className="flex flex-col items-start rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
                Digital Rental Workflow
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                From initial request to landlord approval, payment, and tenant
                review submission, every step is managed directly inside your
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dual Call-to-Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white dark:from-blue-700 dark:to-indigo-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to find your ideal nest?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                Create your tenant account today to start submitting rental
                applications, track your approvals, and secure your next home.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/properties"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-blue-50"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/auth/register?role=TENANT"
                  className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign Up as Tenant
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold">Are you a Property Landlord?</h3>
              <p className="mt-2 text-xs leading-relaxed text-blue-100 sm:text-sm">
                List your residential apartments or houses, reach qualified
                tenants across Bangladesh, and manage rental requests seamlessly.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/register?role=LANDLORD"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-md transition hover:bg-neutral-100"
                >
                  List Your Property
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
