import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/types/property";
import { Bed, Bath, Maximize2, MapPin, Building } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";

  const formattedRent = Number(property.monthlyRent).toLocaleString("en-BD");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {property.category && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-200">
              <Building className="h-3 w-3 text-blue-600" />
              {property.category.name}
            </span>
          )}
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm ${
              property.status === "AVAILABLE"
                ? "bg-emerald-500 text-white"
                : "bg-neutral-600 text-white"
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* Rent Badge overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xl font-extrabold tracking-tight">
            ৳{formattedRent}
            <span className="text-xs font-normal text-white/80"> / month</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="truncate">
            {property.area ? `${property.area}, ` : ""}
            {property.city}, {property.country}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 line-clamp-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
          <Link href={`/properties/${property.id}`} className="focus:outline-none">
            <span className="absolute inset-0 z-10" />
            {property.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
          {property.description}
        </p>

        {/* Specs bar */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-neutral-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-neutral-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            {property.areaSqFt && (
              <div className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4 text-neutral-500" />
                <span>{property.areaSqFt} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
