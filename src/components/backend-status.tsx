"use client";

import { useQuery } from "@tanstack/react-query";
import { checkBackendHealth } from "@/services/health.service";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function BackendStatusBadge() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["backend-health"],
    queryFn: checkBackendHealth,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
        <span>Checking backend status...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
        <span>Backend Offline: {error instanceof Error ? error.message : "Connection failed"}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>Backend Connected (Production Healthy: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "OK"})</span>
    </div>
  );
}
