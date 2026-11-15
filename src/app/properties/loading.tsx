import { PropertyGridSkeleton } from "@/components/property-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-8" />
      <PropertyGridSkeleton count={6} />
    </div>
  );
}
