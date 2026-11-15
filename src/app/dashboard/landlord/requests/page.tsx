"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchLandlordRentalRequests,
  updateRentalRequestStatus,
  completeRentalRequest,
} from "@/services/rental.service";
import { StatusBadge } from "@/components/status-badge";
import { RentalRequest, RentalRequestStatus } from "@/types/rental";
import {
  FileText,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

const FILTER_TABS: { label: string; value: RentalRequestStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function LandlordRequestsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<RentalRequestStatus | "ALL">("ALL");

  // Modal State for Action (Approve / Reject / Complete)
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "COMPLETE" | null>(null);
  const [landlordResponse, setLandlordResponse] = useState<string>("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["landlord-rental-requests"],
    queryFn: () => fetchLandlordRentalRequests(),
  });

  const requests = data?.requests || [];

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === "ALL") return true;
    return r.status === activeFilter;
  });

  // Approve / Reject Mutation
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      response,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
      response?: string;
    }) =>
      updateRentalRequestStatus(id, {
        status,
        landlordResponse: response || undefined,
      }),
    onSuccess: (updated) => {
      toast.success(
        `Rental application marked as ${updated.status === "APPROVED" ? "Approved" : "Rejected"}`
      );
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["landlord-rental-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to update request status";
      toast.error(msg);
    },
  });

  // Complete Rental Mutation
  const completeMutation = useMutation({
    mutationFn: (id: string) => completeRentalRequest(id),
    onSuccess: () => {
      toast.success("Tenancy marked as completed! Property restored to Available.");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["landlord-rental-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to complete rental";
      toast.error(msg);
    },
  });

  const openActionModal = (
    req: RentalRequest,
    type: "APPROVE" | "REJECT" | "COMPLETE"
  ) => {
    setSelectedRequest(req);
    setActionType(type);
    setLandlordResponse("");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setActionType(null);
    setLandlordResponse("");
  };

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return;

    if (actionType === "APPROVE") {
      statusMutation.mutate({
        id: selectedRequest.id,
        status: "APPROVED",
        response: landlordResponse || "Your rental application has been approved.",
      });
    } else if (actionType === "REJECT") {
      statusMutation.mutate({
        id: selectedRequest.id,
        status: "REJECTED",
        response: landlordResponse || "Sorry, we are unable to accept your application at this time.",
      });
    } else if (actionType === "COMPLETE") {
      completeMutation.mutate(selectedRequest.id);
    }
  };

  const isPendingAction = statusMutation.isPending || completeMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Incoming Rental Applications ({requests.length})
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Review applicant profiles, approve leases, and manage tenancy completions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-neutral-400 mr-1" />
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === "ALL"
              ? requests.length
              : requests.filter((r) => r.status === tab.value).length;
          const isSelected = activeFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/25 text-white"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Failed to load rental requests
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
              <FileText className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {activeFilter === "ALL"
                ? "No rental applications received yet"
                : `No ${activeFilter.toLowerCase()} applications`}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              When prospective tenants apply for your properties, they will appear here for your review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/60 lg:flex-row lg:items-center lg:justify-between dark:hover:bg-neutral-800/30"
              >
                {/* Tenant & Property Details */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {req.tenant?.name?.charAt(0).toUpperCase() || "T"}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {req.tenant?.name || "Prospective Tenant"}
                      </span>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-neutral-400" />
                        {req.tenant?.email}
                      </span>
                      {req.tenant?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />
                          {req.tenant.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Listing: {req.property?.title || "Property"}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ৳{Number(req.property?.monthlyRent ?? req.rentalAmount ?? 0).toLocaleString()}/mo
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <Calendar className="h-3 w-3" />
                        Move-in: {new Date(req.moveInDate).toLocaleDateString()}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500">
                        Duration: {req.leaseDurationMonths ?? req.leaseDuration ?? 12} Months
                      </span>
                    </div>

                    {req.message && (
                      <p className="rounded-xl bg-neutral-100/70 p-2 text-xs italic text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-300">
                        &ldquo;{req.message}&rdquo;
                      </p>
                    )}

                    {req.landlordResponse && (
                      <p className="rounded-xl bg-blue-50/70 p-2 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                        <span className="font-semibold">Your Note:</span> &ldquo;{req.landlordResponse}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Landlord Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                  {req.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => openActionModal(req, "APPROVE")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openActionModal(req, "REJECT")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {req.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() => openActionModal(req, "COMPLETE")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Complete Tenancy</span>
                    </button>
                  )}

                  {req.status === "APPROVED" && (
                    <span className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Awaiting Payment
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation & Response Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  actionType === "APPROVE"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : actionType === "REJECT"
                    ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {actionType === "APPROVE" && <CheckCircle className="h-6 w-6" />}
                {actionType === "REJECT" && <XCircle className="h-6 w-6" />}
                {actionType === "COMPLETE" && <CheckCircle2 className="h-6 w-6" />}
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {actionType === "APPROVE" && "Approve Rental Request"}
                  {actionType === "REJECT" && "Reject Rental Request"}
                  {actionType === "COMPLETE" && "Complete Tenancy Lease"}
                </h3>
                <p className="text-xs text-neutral-500">
                  Applicant: {selectedRequest.tenant?.name} ({selectedRequest.property?.title})
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-800/40">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Monthly Rent:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  ৳{Number(selectedRequest.property?.monthlyRent ?? selectedRequest.rentalAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Requested Move-in:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {new Date(selectedRequest.moveInDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Lease Duration:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedRequest.leaseDurationMonths ?? selectedRequest.leaseDuration ?? 12} Months
                </span>
              </div>
            </div>

            {actionType !== "COMPLETE" ? (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Response Message to Tenant (Optional)
                </label>
                <textarea
                  rows={3}
                  value={landlordResponse}
                  onChange={(e) => setLandlordResponse(e.target.value)}
                  placeholder={
                    actionType === "APPROVE"
                      ? "e.g. Approved! Welcome to the property. Please complete the lease payment."
                      : "e.g. Sorry, we cannot accept this application."
                  }
                  className="mt-1 w-full rounded-xl border border-neutral-300 bg-white p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            ) : (
              <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Marking this tenancy complete will conclude the rental contract, restore the property status back to <strong className="text-emerald-600">AVAILABLE</strong> on the marketplace, and permit the tenant to submit their verified property review.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={isPendingAction}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isPendingAction}
                className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white transition disabled:opacity-50 ${
                  actionType === "APPROVE"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : actionType === "REJECT"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isPendingAction ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {actionType === "APPROVE" && "Confirm Approval"}
                    {actionType === "REJECT" && "Confirm Rejection"}
                    {actionType === "COMPLETE" && "Confirm Completion"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
