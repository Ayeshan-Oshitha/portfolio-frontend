import { useState } from "react";
import { Ban, Trash2 } from "lucide-react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import {
  useDeleteUser,
  useDisableUser,
  useUsers,
} from "@/admin/hooks/useUsers";
import { toErrorMessage } from "@/admin/api/ApiError";
import useAuth from "@/admin/context/useAuth";
import useToast from "@/admin/context/useToast";
import type { AdminUser, UserStatus } from "@/admin/types";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  Input,
  PageHeader,
  Pagination,
  Select,
  Toolbar,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: readonly { value: UserStatus; label: string }[] = [
  {
    value: "email_verification_required",
    label: statusLabel("email_verification_required"),
  },
  { value: "pending", label: statusLabel("pending") },
  { value: "approved", label: statusLabel("approved") },
  { value: "rejected", label: statusLabel("rejected") },
  { value: "disabled", label: statusLabel("disabled") },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [status, setStatus] = useSearchParamState<UserStatus | "">(
    "status",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [disableTarget, setDisableTarget] = useState<AdminUser | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useUsers({
    search,
    status: status || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteUserMutation = useDeleteUser();
  const disableUserMutation = useDisableUser();

  const error = queryError ? toErrorMessage(queryError) : null;

  function askDelete(target: AdminUser) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteUserMutation.mutateAsync(deleteTarget.id);
      toast.success("User deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      // Includes the API's `cannot_delete_self` message.
      toast.error(toErrorMessage(cause));
    }
  }

  function askDisable(target: AdminUser) {
    setDisableTarget(target);
  }

  async function confirmDisable() {
    if (!disableTarget) return;

    try {
      await disableUserMutation.mutateAsync(disableTarget.id);
      toast.success("User disabled.");
      setDisableTarget(null);
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
        title="Users"
        description={`${total} ${total === 1 ? "account" : "accounts"} registered.`}
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Name or email"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />

        <Select
          fieldSize="sm"
          label="Status"
          placeholder="All statuses"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as UserStatus | "");
          }}
          containerClassName="w-44"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyTitle="No users found"
          emptyDescription="No users match this search."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Last sign-in</TH>
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
                  <TD>
                    <Badge variant="outline">{statusLabel(item.status)}</Badge>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.lastLoginAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => askDisable(item)}
                          disabled={item.id === currentUser?.id}
                          icon={<Ban className="h-4 w-4" />}
                          iconPosition="left"
                        >
                          Disable
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => askDelete(item)}
                        disabled={item.id === currentUser?.id}
                        icon={<Trash2 className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        Delete
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

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete user"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.firstName} ${deleteTarget.lastName} (${deleteTarget.email})?`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteUserMutation.isPending}
      />

      <ConfirmDialog
        open={disableTarget !== null}
        title="Disable user"
        confirmLabel="Disable"
        message={
          disableTarget
            ? `Disable ${disableTarget.firstName} ${disableTarget.lastName} (${disableTarget.email})? They will not be able to sign in.`
            : ""
        }
        onConfirm={confirmDisable}
        onCancel={() => setDisableTarget(null)}
        loading={disableUserMutation.isPending}
      />
    </div>
  );
}
