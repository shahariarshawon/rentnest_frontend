"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fetchRentalRequestById } from "@/services/rental.service";
import { createPaymentSession } from "@/services/payment.service";
import {
  paymentFormSchema,
  PaymentFormValues,
} from "@/lib/validations/payment.schema";
import { useAuthStore } from "@/hooks/use-auth";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Lock,
  Phone,
  MapPin,
  ShieldAlert,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function TenantPaymentCheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenant-rental-request", id],
    queryFn: () => fetchRentalRequestById(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      customerPhone: user?.phone || "01711000000",
      customerAddress: "House 12, Road 5, Block B",
      customerCity: "Dhaka",
      customerPostcode: "1212",
    },
  });

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      toast.loading("Initiating SSLCommerz payment session...", { id: "payment-session" });

      const response = await createPaymentSession({
        rentalRequestId: id,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        customerCity: values.customerCity,
        customerPostcode: values.customerPostcode,
      });

      if (response.checkoutUrl) {
        toast.success("Payment session ready. Redirecting to SSLCommerz...", {
          id: "payment-session",
        });
        // Real SSLCommerz Gateway redirect
        window.location.assign(response.checkoutUrl);
      } else {
        toast.success("Payment processed successfully!", { id: "payment-session" });
        router.push(`/dashboard/tenant/requests/${id}`);
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to initiate payment session";
      toast.error(errorMessage, { id: "payment-session" });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-neutral-900" />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
          Rental Request Not Found
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          {(error as Error)?.message || "Cannot initiate payment for this request."}
        </p>
        <Link
          href="/dashboard/tenant/requests"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Requests
        </Link>
      </div>
    );
  }

  // Verify eligibility for payment
  if (request.status !== "APPROVED") {
    return (
      <div className="space-y-6">
        <Link
          href={`/dashboard/tenant/requests/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Request Details</span>
        </Link>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
            Payment Not Eligible
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Payment is only permitted for rental requests with status <strong className="text-blue-600">APPROVED</strong>.
            Current status is <span className="font-semibold">{request.status}</span>.
          </p>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={request.status} />
          </div>
          <div className="mt-6">
            <Link
              href={`/dashboard/tenant/requests/${id}`}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Return to Request
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { property } = request;
  const monthlyRent = Number(property?.monthlyRent ?? request.rentalAmount);
  const securityDeposit = Number(property?.securityDeposit ?? 0);
  const totalAmount = monthlyRent + securityDeposit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/tenant/requests/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Request Details</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
          <Lock className="h-3.5 w-3.5" />
          <span className="font-semibold">SSLCommerz 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Order & Property Summary */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Lease Order Summary
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {property?.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    <Building2 className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {property?.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {property?.city}, {property?.country}
                  </span>
                </p>
                <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Approved by Landlord
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-neutral-100 pt-4 text-xs dark:border-neutral-800">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>First Month Rent</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  ৳{monthlyRent.toLocaleString()}
                </span>
              </div>
              {securityDeposit > 0 && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    ৳{securityDeposit.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200/80 pt-3 text-sm font-bold text-neutral-900 dark:border-neutral-700 dark:text-neutral-100">
                <span>Total Amount Due</span>
                <span className="text-base text-blue-600 dark:text-blue-400">
                  ৳{totalAmount.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-[11px] leading-relaxed text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
              <p className="font-semibold">Automated Activation:</p>
              <p className="mt-0.5">
                Upon verified payment via SSLCommerz, this rental application will automatically become <span className="font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</span> and the property marked as <span className="font-bold">RENTED</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Billing Information Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Customer Billing & Gateway Information
                </h3>
                <p className="text-xs text-neutral-500">
                  Required by SSLCommerz for payment session generation
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="tel"
                    {...register("customerPhone")}
                    placeholder="017XXXXXXXX"
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                {errors.customerPhone && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              {/* Customer Address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Billing Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("customerAddress")}
                  placeholder="Street address, apartment or house number"
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.customerAddress && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.customerAddress.message}
                  </p>
                )}
              </div>

              {/* City and Postcode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("customerCity")}
                    placeholder="e.g. Dhaka"
                    className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                  {errors.customerCity && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.customerCity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("customerPostcode")}
                    placeholder="e.g. 1212"
                    className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                  {errors.customerPostcode && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.customerPostcode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Supported payment channels note */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3 text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-400">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Supported Payment Options on SSLCommerz:
                </p>
                <p className="mt-0.5">
                  bKash, Nagad, Rocket, Upay, Visa, MasterCard, UnionPay, and Bangladeshi Internet Banking.
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting to SSLCommerz Gateway...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    <span>Pay ৳{totalAmount.toLocaleString()} via SSLCommerz</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
