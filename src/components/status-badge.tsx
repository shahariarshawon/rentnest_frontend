export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          PENDING
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
          APPROVED
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          REJECTED
        </span>
      );
    case "ACTIVE":
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          ACTIVE
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400" />
          COMPLETED
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-bold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400" />
          CANCELLED
        </span>
      );
    case "AVAILABLE":
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AVAILABLE
        </span>
      );
    case "RENTED":
      return (
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
          RENTED
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400" />
          UNAVAILABLE
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          FAILED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {status}
        </span>
      );
  }
}
