"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth";
import type { Property } from "@/types/property";
import { RequestRentModal } from "./request-rent-modal";
import {
  MapPin,
  Building,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  ShieldCheck,
  User,
  ArrowLeft,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface PropertyDetailsViewProps {
  property: Property;
}

export function PropertyDetailsView({ property }: PropertyDetailsViewProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        ];

  const formattedRent = Number(property.monthlyRent).toLocaleString("en-BD");
  const formattedDeposit = property.securityDeposit
    ? Number(property.securityDeposit).toLocaleString("en-BD")
    : null;

  const handleRequestToRent = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to submit a rental request.");
      router.push(`/auth/login?redirect=/properties/${property.id}`);
      return;
    }

    if (user?.role !== "TENANT") {
      toast.error(
        `Only Tenant accounts can submit rental requests. You are signed in as ${user?.role}.`,
      );
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all properties
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content (Images + Info) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-800">
              <Image
                src={images[selectedImageIndex] || images[0]}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />

              <div className="absolute top-4 left-4 flex gap-2">
                {property.category && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-3 py-1 text-xs font-bold text-neutral-800 shadow-md backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-200">
                    <Building className="h-3.5 w-3.5 text-blue-600" />
                    {property.category.name}
                  </span>
                )}
                <span
                  className={`rounded-md px-3 py-1 text-xs font-bold shadow-md ${
                    property.status === "AVAILABLE"
                      ? "bg-emerald-500 text-white"
                      : "bg-neutral-600 text-white"
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[16/10] h-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImageIndex === index
                        ? "border-blue-600"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Info */}
          <div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>
                {property.address}
                {property.area ? `, ${property.area}` : ""}, {property.city},{" "}
                {property.country}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
              {property.title}
            </h1>

            {/* Specs Bar */}
            <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 text-xs text-neutral-700 sm:gap-6 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{property.bathrooms} Bathrooms</span>
              </div>
              {property.areaSqFt && (
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{property.areaSqFt} Sq Ft</span>
                </div>
              )}
              {property.availableFrom && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>
                    Available from{" "}
                    {new Date(property.availableFrom).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              About this property
            </h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-neutral-600 dark:text-neutral-300">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Amenities & Features
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-white p-3 text-xs font-semibold text-neutral-800 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            {/* Rent Pricing Card */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Monthly Rent
              </span>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                ৳{formattedRent}
                <span className="text-sm font-normal text-neutral-500">
                  {" "}
                  / month
                </span>
              </p>

              {formattedDeposit && (
                <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Security Deposit:</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    ৳{formattedDeposit}
                  </span>
                </div>
              )}
            </div>

            {/* Request to rent button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleRequestToRent}
                disabled={property.status !== "AVAILABLE"}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-sm transition ${
                  property.status === "AVAILABLE"
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    : "cursor-not-allowed bg-neutral-300 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500"
                }`}
              >
                <Send className="h-4 w-4" />
                <span>
                  {property.status === "AVAILABLE"
                    ? "Request to Rent"
                    : "Property Not Available"}
                </span>
              </button>

              {!isAuthenticated && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  You will be prompted to login as a Tenant to apply.
                </p>
              )}
            </div>

            {/* Landlord Summary */}
            {property.landlord && (
              <div className="mt-6 border-t border-neutral-100 pt-6 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Listing Landlord
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {property.landlord.name}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Landlord
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust highlights */}
            <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4 text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Rent payment protected by SSLCommerz</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>No hidden agent brokerage fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Request Modal */}
      <RequestRentModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
