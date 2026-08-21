import { useState } from "react";
import { Check, X } from "lucide-react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/admin/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import RejectUserDialog from "@/admin/components/users/RejectUserDialog";
import { useApproveUser, useRejectUser, useUsers } from "@/admin/hooks/useUsers";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminUser } from "@/admin/types";
import { formatDate, roleLabel } from "@/admin/utils/format";

const PAGE_SIZE = 20;

export default function PendingApprovalsPage() {
  const toast = useToast();
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useUsers({ status: "pending", page, pageSize: PAGE_SIZE });
  const approveUserMutation = useApproveUser();
  const rejectUserMutation = useRejectUser();

  const error = queryError ? toErrorMessage(queryError) : null;

  async function handleApprove(target: AdminUser) {
    setApprovingId(target.id);
    try {
      await approveUserMutation.mutateAsync(target.id);
      toast.success("User approved.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejectTarget) return;

    try {
      await rejectUserMutation.mutateAsync({
        id: rejectTarget.id,
        body: { reason },
      });
      toast.success("User rejected.");
      setRejectTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Pending approvals
      </h1>
      <p className="text-sm text-text-muted mb-8">
        {total} {total === 1 ? "account" : "accounts"} waiting for approval.
      </p>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading pending accounts" />
          </div>
        ) : !result || result.items.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No accounts waiting for approval.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-900/40 text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0 hover:bg-surface-800/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <span className="block text-text-primary font-medium">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="block text-text-muted text-xs">
                        {item.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="subtle">{roleLabel(item.role)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(item)}
                          loading={approvingId === item.id}
                          icon={<Check className="h-4 w-4" />}
                          iconPosition="left"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRejectTarget(item)}
                          icon={<X className="h-4 w-4" />}
                          iconPosition="left"
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <RejectUserDialog
        target={rejectTarget}
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        loading={rejectUserMutation.isPending}
      />
    </div>
  );
}
