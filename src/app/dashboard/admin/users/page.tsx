"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchAdminUsers, updateAdminUserStatus } from "@/services/admin.service";
import { AdminUser } from "@/types/admin";
import { UserRole } from "@/types/auth";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentAdmin } = useAuthStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");
  const [page, setPage] = useState(1);

  // Ban/Unban Confirmation Modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [targetAction, setTargetAction] = useState<"ACTIVE" | "BANNED" | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-users", search, roleFilter, statusFilter, page],
    queryFn: () =>
      fetchAdminUsers({
        search: search.trim() || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        page,
        limit: 10,
      }),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BANNED" }) =>
      updateAdminUserStatus(id, status),
    onSuccess: (updated) => {
      toast.success(
        `User ${updated.name} has been ${updated.status === "BANNED" ? "banned" : "unbanned"} successfully.`
      );
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-summary"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Failed to update user status";
      toast.error(msg);
    },
  });

  const openModal = (user: AdminUser, action: "ACTIVE" | "BANNED") => {
    setSelectedUser(user);
    setTargetAction(action);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setTargetAction(null);
  };

  const confirmAction = () => {
    if (!selectedUser || !targetAction) return;
    mutation.mutate({ id: selectedUser.id, status: targetAction });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            User Management Directory
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Monitor platform accounts, filter roles, inspect registrations, and enforce bans.
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

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Search */}
        <div className="relative sm:col-span-6">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email address..."
            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        {/* Role Filter */}
        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | "ALL");
              setPage(1);
            }}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="ALL">All Roles</option>
            <option value="TENANT">Tenants Only</option>
            <option value="LANDLORD">Landlords Only</option>
            <option value="ADMIN">Admins Only</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "BANNED");
              setPage(1);
            }}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="BANNED">Banned Accounts</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Failed to load users
            </p>
            <p className="mt-1 text-xs text-neutral-500">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No users match the specified search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {users.map((u) => {
                  const isCurrentAdmin = currentAdmin?.id === u.id;
                  const isOtherAdmin = u.role === "ADMIN";

                  return (
                    <tr
                      key={u.id}
                      className="transition hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                        {u.phone || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                              : u.role === "LANDLORD"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {u.status === "ACTIVE" ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <ShieldAlert className="h-3 w-3" />
                          )}
                          <span>{u.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-neutral-500">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isCurrentAdmin ? (
                          <span className="text-[11px] italic text-neutral-400">
                            Current Session
                          </span>
                        ) : isOtherAdmin ? (
                          <span className="text-[11px] italic text-neutral-400">
                            Admin Protected
                          </span>
                        ) : u.status === "ACTIVE" ? (
                          <button
                            type="button"
                            onClick={() => openModal(u, "BANNED")}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                          >
                            <UserX className="h-3 w-3" />
                            <span>Ban User</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openModal(u, "ACTIVE")}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                          >
                            <UserCheck className="h-3 w-3" />
                            <span>Unban User</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 text-xs text-neutral-500 dark:border-neutral-800">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total users)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedUser && targetAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                targetAction === "BANNED"
                  ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
              {targetAction === "BANNED" ? "Ban User Account?" : "Unban User Account?"}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Are you sure you want to{" "}
              <strong>{targetAction === "BANNED" ? "ban" : "restore"}</strong> the account of{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {selectedUser.name} ({selectedUser.email})
              </strong>
              ?{" "}
              {targetAction === "BANNED"
                ? "This will immediately restrict the user from creating or managing rental applications and listings."
                : "This will restore full access to their account."}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={mutation.isPending}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                disabled={mutation.isPending}
                className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white transition disabled:opacity-50 ${
                  targetAction === "BANNED"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {targetAction === "BANNED" ? "Confirm Ban" : "Confirm Restore"}
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
