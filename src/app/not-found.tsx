import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        <Compass className="h-8 w-8" />
      </div>

      <span className="mt-4 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        404 — Page Not Found
      </span>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
        The page you are looking for doesn&apos;t exist
      </h1>

      <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        The link you followed may be broken or the listing might have been removed. Explore verified properties on RentNest.
      </p>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          <span>Explore Properties</span>
        </Link>
      </div>
    </div>
  );
}
