"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchLandlordProperties,
  deleteLandlordProperty,
  updateLandlordPropertyStatus,
} from "@/services/landlord-property.service";
import { StatusBadge } from "@/components/status-badge";
import { Property } from "@/types/property";
import {
  Building2,
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  Bed,
  Bath,
  AlertCircle,
  RefreshCw,
  Power,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function LandlordPropertiesPage() {
  const queryClient = useQueryClient();
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => fetchLandlordProperties(),
  });

  const properties = data?.properties || [];

  // Toggle Availability Mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "AVAILABLE" | "UNAVAILABLE" }) =>
      updateLandlordPropertyStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`Property marked as ${updated.status}`);
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to update availability";
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLandlordProperty(id),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      setPropertyToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to delete property";
      toast.error(msg);
    },
  });

  const handleToggleStatus = (p: Property) => {
    if (p.status === "RENTED") {
      toast.info("This property is currently rented by an active tenant.");
      return;
    }
    const nextStatus = p.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    toggleMutation.mutate({ id: p.id, status: nextStatus });
  };

  const confirmDelete = () => {
    if (!propertyToDelete) return;
    deleteMutation.mutate(propertyToDelete.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            My Properties ({properties.length})
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Manage your real estate listings, toggle availability, and edit details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Properties List */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Failed to load properties
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              You haven&apos;t listed any properties yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Create your first property listing to start receiving tenant applications.
            </p>
            <Link
              href="/dashboard/landlord/properties/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              List First Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/60 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-neutral-800/30"
              >
                {/* Image and Info */}
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        target="_blank"
                        className="text-sm font-bold text-neutral-900 hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400 inline-flex items-center gap-1"
                      >
                        <span>{property.title}</span>
                        <ExternalLink className="h-3 w-3 text-neutral-400" />
                      </Link>
                      <StatusBadge status={property.status} />
                    </div>

                    <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>
                        {property.address}, {property.city}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        ৳{Number(property.monthlyRent).toLocaleString()} / month
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <Bed className="h-3 w-3" />
                        {property.bedrooms} Beds
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms} Baths
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500">
                        {property.category?.name || "Apartment"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Availability Toggle */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {/* Availability Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(property)}
                    disabled={property.status === "RENTED" || toggleMutation.isPending}
                    title={
                      property.status === "RENTED"
                        ? "Occupied by tenant"
                        : "Toggle Available / Unavailable"
                    }
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      property.status === "AVAILABLE"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                        : property.status === "RENTED"
                        ? "border border-blue-200 bg-blue-50 text-blue-700 opacity-60 cursor-not-allowed dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                        : "border border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>
                      {property.status === "AVAILABLE"
                        ? "Available"
                        : property.status === "RENTED"
                        ? "Rented"
                        : "Unavailable"}
                    </span>
                  </button>

                  {/* Edit Button */}
                  <Link
                    href={`/dashboard/landlord/properties/${property.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setPropertyToDelete(property)}
                    disabled={property.status === "RENTED"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
              Delete Property Listing?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Are you sure you want to delete{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                &ldquo;{propertyToDelete.title}&rdquo;
              </strong>
              ? This action is permanent and cannot be undone. Backend rules prohibit deleting properties with active rental history.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Listing</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
