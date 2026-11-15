"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerFormSchema,
  type RegisterFormData,
} from "@/lib/validations/auth.schema";
import { useAuthStore } from "@/hooks/use-auth";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Home,
  Building,
} from "lucide-react";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "LANDLORD" ? "LANDLORD" : "TENANT";

  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD">(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registerUserAction = useAuthStore((state) => state.register);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const user = await registerUserAction(data);
      toast.success(
        `Registration successful! Welcome to RentNest, ${user.name}.`,
      );

      // Redirect directly to the appropriate dashboard
      if (user.role === "LANDLORD") {
        router.push("/dashboard/landlord");
      } else {
        router.push("/dashboard/tenant");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  const handleRoleSelect = (role: "TENANT" | "LANDLORD") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Create your RentNest account
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Join RentNest as a Tenant searching for rentals or as a Landlord
            listing properties.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection Tabs */}
          <div>
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              I am registering as:
            </span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("TENANT")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  selectedRole === "TENANT"
                    ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Tenant (Rent a Home)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("LANDLORD")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  selectedRole === "LANDLORD"
                    ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Landlord (List Homes)</span>
              </button>
            </div>
            {errors.role && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Full name
            </label>
            <div className="relative mt-1.5">
              <User className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Shahriar Arafat"
                {...register("name")}
                className={`w-full rounded-xl border py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

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

          {/* Phone (Optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Phone number{" "}
              <span className="text-[10px] font-normal text-neutral-400">
                (Optional)
              </span>
            </label>
            <div className="relative mt-1.5">
              <Phone className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="017XXXXXXXX"
                {...register("phone")}
                className={`w-full rounded-xl border py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  {...register("password")}
                  className={`w-full rounded-xl border py-2.5 pr-8 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Confirm password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-neutral-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                  className={`w-full rounded-xl border py-2.5 pr-8 pl-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-neutral-200 focus:border-blue-500 dark:border-neutral-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
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
                <span>Creating your account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
