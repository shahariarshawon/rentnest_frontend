"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/property.service";
import {
  landlordPropertyFormSchema,
  LandlordPropertyFormData,
} from "@/lib/validations/property.schema";
import { Property } from "@/types/property";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  CheckSquare,
  Loader2,
  Save,
} from "lucide-react";

const COMMON_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Generator Backup",
  "Parking",
  "Elevator / Lift",
  "24/7 Security",
  "Balcony",
  "Furnished",
  "CCTV Monitoring",
  "Natural Gas",
  "Water Supply",
  "Fire Exit",
];

interface LandlordPropertyFormProps {
  initialData?: Property;
  isEditing?: boolean;
  isSubmitting: boolean;
  onSubmit: (data: LandlordPropertyFormData) => void;
}

export function LandlordPropertyForm({
  initialData,
  isEditing = false,
  isSubmitting,
  onSubmit,
}: LandlordPropertyFormProps) {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || ["WiFi", "Elevator / Lift", "24/7 Security"]
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LandlordPropertyFormData>({
    resolver: zodResolver(landlordPropertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      area: initialData?.area || "",
      city: initialData?.city || "Dhaka",
      country: initialData?.country || "Bangladesh",
      monthlyRent: initialData ? Number(initialData.monthlyRent) : 25000,
      securityDeposit: initialData?.securityDeposit
        ? Number(initialData.securityDeposit)
        : 50000,
      bedrooms: initialData?.bedrooms ?? 2,
      bathrooms: initialData?.bathrooms ?? 2,
      areaSqFt: initialData?.areaSqFt ?? 1200,
      categoryId: initialData?.categoryId || "",
      availableFrom: initialData?.availableFrom
        ? new Date(initialData.availableFrom).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      imageUrls: initialData?.images
        ? initialData.images.join("\n")
        : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      amenities: initialData?.amenities || [
        "WiFi",
        "Elevator / Lift",
        "24/7 Security",
      ],
    },
  });

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        address: initialData.address || "",
        area: initialData.area || "",
        city: initialData.city || "Dhaka",
        country: initialData.country || "Bangladesh",
        monthlyRent: Number(initialData.monthlyRent) || 0,
        securityDeposit: initialData.securityDeposit
          ? Number(initialData.securityDeposit)
          : 0,
        bedrooms: initialData.bedrooms ?? 1,
        bathrooms: initialData.bathrooms ?? 1,
        areaSqFt: initialData.areaSqFt ?? undefined,
        categoryId: initialData.categoryId || "",
        availableFrom: initialData.availableFrom
          ? new Date(initialData.availableFrom).toISOString().split("T")[0]
          : "",
        imageUrls: (initialData.images || []).join("\n"),
        amenities: initialData.amenities || [],
      });
    }
  }, [initialData, reset]);

  // Set default category if not editing
  useEffect(() => {
    if (!initialData && categories.length > 0) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, initialData, setValue]);

  const toggleAmenity = (item: string) => {
    let next: string[];
    if (selectedAmenities.includes(item)) {
      next = selectedAmenities.filter((a) => a !== item);
    } else {
      next = [...selectedAmenities, item];
    }
    setSelectedAmenities(next);
    setValue("amenities", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Property Information
        </h3>

        <div className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Listing Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Modern Luxury 3-Bed Apartment in Gulshan 2"
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Available From */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Property Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("categoryId")}
                disabled={loadingCategories}
                className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                {loadingCategories && <option value="">Loading categories...</option>}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Available From
              </label>
              <div className="relative mt-1">
                <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="date"
                  {...register("availableFrom")}
                  className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Describe property features, nearby landmarks, sun exposure, neighborhood vibe, and rules..."
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Specifications */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Pricing & Specifications
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Monthly Rent */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Monthly Rent (BDT) <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                ৳
              </span>
              <input
                type="number"
                {...register("monthlyRent", { valueAsNumber: true })}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-8 pr-3 text-xs font-bold text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            {errors.monthlyRent && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.monthlyRent.message}
              </p>
            )}
          </div>

          {/* Security Deposit */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Security Deposit (BDT)
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                ৳
              </span>
              <input
                type="number"
                {...register("securityDeposit", { valueAsNumber: true })}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-8 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Area Sq Ft */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Area (Sq. Ft.)
            </label>
            <div className="relative mt-1">
              <Maximize2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                {...register("areaSqFt", { valueAsNumber: true })}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Bedrooms <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <Bed className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                min={0}
                {...register("bedrooms", { valueAsNumber: true })}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Bathrooms <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <Bath className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                min={0}
                {...register("bathrooms", { valueAsNumber: true })}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Location Details
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Full Street Address <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                {...register("address")}
                placeholder="e.g. Road 11, House 45, Block D"
                className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-[11px] text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Area / Neighborhood
            </label>
            <input
              type="text"
              {...register("area")}
              placeholder="e.g. Banani / Gulshan"
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("city")}
              placeholder="e.g. Dhaka"
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            {errors.city && (
              <p className="mt-1 text-[11px] text-red-600">{errors.city.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("country")}
              placeholder="e.g. Bangladesh"
              className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Property Images
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          Provide image URLs for your listing. Enter multiple URLs separated by a comma or new line.
        </p>

        <div className="mt-3">
          <textarea
            rows={3}
            {...register("imageUrls")}
            placeholder="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&#10;https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200"
            className="w-full rounded-xl border border-neutral-300 bg-white p-3 font-mono text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
          {errors.imageUrls && (
            <p className="mt-1 text-[11px] text-red-600">{errors.imageUrls.message}</p>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Amenities & Facilities
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {COMMON_AMENITIES.map((item) => {
            const isChecked = selectedAmenities.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAmenity(item)}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium border text-left transition ${
                  isChecked
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200"
                    : "border-neutral-200/80 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    isChecked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                >
                  {isChecked && <CheckSquare className="h-3 w-3" />}
                </div>
                <span className="truncate">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isEditing ? "Saving Changes..." : "Publishing Listing..."}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditing ? "Update Property" : "Publish Property"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
