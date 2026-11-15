import { Building2, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { BackendStatusBadge } from "@/components/backend-status";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              RentNest
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Rental Property Marketplace Frontend
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <div className="mb-4">
            <BackendStatusBadge />
          </div>

          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            Phase 0 (Backend API Audit) and Phase 1 (Frontend Project Setup) have been completed successfully. The application is configured with Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, and Sonner.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800/60 dark:bg-neutral-800/40">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Phase 0 Verified
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                API integration mapping documented
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800/60 dark:bg-neutral-800/40">
            <Layers className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Phase 1 Configured
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Core architecture and providers ready
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800/60 dark:bg-neutral-800/40">
            <Sparkles className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Next Steps
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Ready for Phase 2 implementation
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
