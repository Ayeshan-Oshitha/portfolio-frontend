import { useState } from "react";
import { Check, X } from "lucide-react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import RejectUserDialog from "@/admin/components/users/RejectUserDialog";
import {
  useApproveUser,
  useRejectUser,
  useUsers,
} from "@/admin/hooks/useUsers";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminUser } from "@/admin/types";
import { formatDate, roleLabel } from "@/admin/utils/format";
import {
  Badge,
  Button,
  Card,
  DataTableShell,
  PageHeader,
  Pagination,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/admin/components/ui";

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

  const rows = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Pending approvals"
        description={`${total} ${total === 1 ? "account" : "accounts"} waiting for approval.`}
      />

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyTitle="No pending accounts found"
          emptyDescription="No accounts waiting for approval."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Role</TH>
              <TH>Registered</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item) => (
                <TR key={item.id}>
                  <TD>
                    <span className="block text-text-primary font-medium">
                      {item.firstName} {item.lastName}
                    </span>
                    <span className="block text-text-muted text-xs">
                      {item.email}
                    </span>
                  </TD>
                  <TD>
                    <Badge tone="brand">{roleLabel(item.role)}</Badge>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.createdAt)}</TD>
                  <TD>
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
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </DataTableShell>
      </Card>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(next) => setPage(next)}
      />

      <RejectUserDialog
        target={rejectTarget}
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        loading={rejectUserMutation.isPending}
      />
    </div>
  );
}
