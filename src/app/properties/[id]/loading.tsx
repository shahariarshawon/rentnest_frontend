export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800 mb-6" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-[16/10] w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-16 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div>
          <div className="h-72 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
