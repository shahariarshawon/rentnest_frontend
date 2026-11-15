"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
