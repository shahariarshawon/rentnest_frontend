import { Suspense } from "react";
import { PropertiesExplorer } from "@/components/properties-explorer";
import { PropertyGridSkeleton } from "@/components/property-skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Properties — RentNest",
  description:
    "Filter and explore verified rental apartments, independent houses, modern studios, and villas across Bangladesh.",
};

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-8" />
          <PropertyGridSkeleton count={6} />
        </div>
      }
    >
      <PropertiesExplorer />
    </Suspense>
  );
}
