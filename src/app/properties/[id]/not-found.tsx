import Link from "next/link";
import { Building, ArrowLeft } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
        <Building className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Property Not Found
      </h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        The property you are looking for does not exist, has already been rented,
        or was marked unavailable by the landlord.
      </p>
      <Link
        href="/properties"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Explore Available Properties
      </Link>
    </div>
  );
}
