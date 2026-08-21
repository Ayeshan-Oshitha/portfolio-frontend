import { useState } from "react";
import { Ban, Trash2 } from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
import { useDeleteUser, useDisableUser, useUsers } from "@/admin/hooks/useUsers";
import { toErrorMessage } from "@/admin/api/ApiError";
import useAuth from "@/admin/context/useAuth";
import useToast from "@/admin/context/useToast";
import type { AdminUser, UserStatus } from "@/admin/types";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: readonly { value: UserStatus; label: string }[] = [
  { value: "pending", label: statusLabel("pending") },
  { value: "approved", label: statusLabel("approved") },
  { value: "rejected", label: statusLabel("rejected") },
  { value: "disabled", label: statusLabel("disabled") },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput);
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [disableTarget, setDisableTarget] = useState<AdminUser | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useUsers({ search, status: status || undefined, page, pageSize: PAGE_SIZE });
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

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Users</h1>
      <p className="text-sm text-text-muted mb-8">
        {total} {total === 1 ? "account" : "accounts"} registered.
      </p>

      <div className="flex items-end gap-3 mb-6">
        <Input
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
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading users" />
          </div>
        ) : !result || result.items.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No users match this search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last sign-in</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0"
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
                    <td className="px-6 py-4">
                      <Badge variant="outline">
                        {statusLabel(item.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDate(item.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4">
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
