"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProperties, fetchCategories } from "@/services/property.service";
import { PropertyCard } from "./property-card";
import { PropertyGridSkeleton } from "./property-skeleton";
import type { PropertyFilterParams } from "@/types/property";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Building,
  AlertTriangle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const COMMON_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Elevator",
  "Parking",
  "Security",
  "Balcony",
  "Gym",
  "Garden",
  "Furnished",
  "Swimming Pool",
];

export function PropertiesExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial values from URL
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "",
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  );
  const [bedrooms, setBedrooms] = useState<number | undefined>(
    searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
  );
  const [bathrooms, setBathrooms] = useState<number | undefined>(
    searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",").filter(Boolean)
      : [],
  );
  const [sortBy, setSortBy] = useState<"createdAt" | "monthlyRent">(
    (searchParams.get("sortBy") as "createdAt" | "monthlyRent") || "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  );
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  );

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Query parameters object
  const queryParams: PropertyFilterParams = {
    search: searchTerm.trim() || undefined,
    city: city.trim() || undefined,
    category: category || undefined,
    minPrice: minPrice !== undefined && minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice !== undefined && maxPrice > 0 ? maxPrice : undefined,
    bedrooms: bedrooms !== undefined && bedrooms >= 0 ? bedrooms : undefined,
    bathrooms: bathrooms !== undefined && bathrooms >= 0 ? bathrooms : undefined,
    amenities:
      selectedAmenities.length > 0 ? selectedAmenities.join(",") : undefined,
    sortBy,
    sortOrder,
    page,
    limit: 9,
  };

  // Fetch properties using TanStack Query with real-time response
  const {
    data: propertiesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties", queryParams],
    queryFn: () => fetchProperties(queryParams),
    staleTime: 30 * 1000,
  });

  const properties = propertiesData?.properties ?? [];
  const pagination = propertiesData?.pagination ?? {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  };

  const handleAmenityToggle = (amenity: string) => {
    setPage(1);
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCity("");
    setCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setBedrooms(undefined);
    setBathrooms(undefined);
    setSelectedAmenities([]);
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);

    startTransition(() => {
      router.push("/properties");
    });
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
      city ||
      category ||
      minPrice ||
      maxPrice ||
      bedrooms !== undefined ||
      bathrooms !== undefined ||
      selectedAmenities.length > 0,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
            Available Rental Properties
          </h1>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
            {isLoading
              ? "Loading properties..."
              : `Showing ${properties.length} of ${pagination.total} verified listings`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 md:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Filters {hasActiveFilters && "•"}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="hidden text-neutral-500 sm:inline">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-") as [
                  "createdAt" | "monthlyRent",
                  "asc" | "desc",
                ];
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              aria-label="Sort properties"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="monthlyRent-asc">Price: Low to High</option>
              <option value="monthlyRent-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filters Sidebar */}
        <aside
          className={`space-y-6 md:block ${
            filterPanelOpen ? "block" : "hidden"
          } rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900`}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div>
            <label
              htmlFor="property-search-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
            >
              Search
            </label>
            <div className="relative mt-1.5">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
              <input
                id="property-search-input"
                type="text"
                placeholder="Title or location keyword"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-neutral-200 py-2 pr-3 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* City / Location */}
          <div>
            <label
              htmlFor="property-city-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
            >
              City
            </label>
            <input
              id="property-city-input"
              type="text"
              placeholder="e.g. Dhaka, Chittagong"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="property-category-select"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
            >
              Property Type
            </label>
            <select
              id="property-category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="">All Types</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Rent Range */}
          <div>
            <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Monthly Rent (BDT)
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice ?? ""}
                  onChange={(e) => {
                    setMinPrice(
                      e.target.value ? Number(e.target.value) : undefined,
                    );
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice ?? ""}
                  onChange={(e) => {
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : undefined,
                    );
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Bedrooms
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[undefined, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num ?? "any"}
                  type="button"
                  onClick={() => {
                    setBedrooms(num);
                    setPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    bedrooms === num
                      ? "bg-blue-600 text-white"
                      : "border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {num === undefined ? "Any" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Bathrooms
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[undefined, 1, 2, 3, 4].map((num) => (
                <button
                  key={num ?? "any"}
                  type="button"
                  onClick={() => {
                    setBathrooms(num);
                    setPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    bathrooms === num
                      ? "bg-blue-600 text-white"
                      : "border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {num === undefined ? "Any" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Multi-select */}
          <div>
            <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Amenities
            </span>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
              {COMMON_AMENITIES.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Property Grid & Results */}
        <section className="md:col-span-3">
          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-neutral-500">Active:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Search: {searchTerm}
                  <button type="button" onClick={() => setSearchTerm("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {city && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  City: {city}
                  <button type="button" onClick={() => setCity("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Type: {category}
                  <button type="button" onClick={() => setCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  ৳{minPrice ?? 0} - ৳{maxPrice ?? "Any"}
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(undefined);
                      setMaxPrice(undefined);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {bedrooms !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Beds: {bedrooms}+
                  <button
                    type="button"
                    onClick={() => setBedrooms(undefined)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Loading state */}
          {isLoading && <PropertyGridSkeleton count={6} />}

          {/* Error state */}
          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
              <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
              <h3 className="mt-3 text-base font-bold text-red-900 dark:text-red-200">
                Failed to load properties
              </h3>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                {error instanceof Error ? error.message : "Network error"}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty Results state */}
          {!isLoading && !isError && properties.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <Building className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                No properties found
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                No rental listings matched your current search filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset All Filters
              </button>
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && !isError && properties.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-800">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="text-xs text-neutral-500">
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
