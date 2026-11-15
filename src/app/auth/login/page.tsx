"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { useAuthStore } from "@/hooks/use-auth";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);

      // Determine redirect destination
      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
        return;
      }

      switch (user.role) {
        case "TENANT":
          router.push("/dashboard/tenant");
          break;
        case "LANDLORD":
          router.push("/dashboard/landlord");
          break;
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setServerError(msg);
      toast.error(msg);
    }
  };

  const fillQuickCredentials = (email: string, pass: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setServerError(null);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Sign in to RentNest
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Enter your credentials to access your account dashboard
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Email address
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`w-full rounded-xl border py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
            </div>
            <div className="relative mt-1.5">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border py-2.5 pr-10 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Demo Test Accounts Selector */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <KeyRound className="h-3.5 w-3.5 text-blue-600" />
            <span>Test Accounts (Quick Fill):</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() =>
                fillQuickCredentials("tenant@example.com", "TenantPass123!")
              }
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Tenant
            </button>
            <button
              type="button"
              onClick={() =>
                fillQuickCredentials(
                  "landlord@example.com",
                  "LandlordPass123!",
                )
              }
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Landlord
            </button>
            <button
              type="button"
              onClick={() =>
                fillQuickCredentials("admin@rentnest.com", "15025")
              }
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
