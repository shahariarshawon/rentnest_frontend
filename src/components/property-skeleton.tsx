export function PropertySkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900 animate-pulse">
      <div className="aspect-[16/10] w-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex justify-between">
          <div className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  );
}
