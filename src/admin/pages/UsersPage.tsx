import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import Input from "@/admin/components/ui/Input";
import { deleteUser, getUsers } from "@/admin/api/users";
import { toErrorMessage } from "@/admin/api/ApiError";
import useAuth from "@/admin/context/useAuth";
import type { AdminUser, PagedResult } from "@/admin/types";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PagedResult<AdminUser> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getUsers({ search, page, pageSize: PAGE_SIZE }, controller.signal)
      .then((data) => {
        setResult(data);
        setIsLoading(false);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError")
          return;
        setError(toErrorMessage(cause));
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [search, page, reloadToken]);

  /**
   * The spinner is raised by whatever triggers a refetch rather than inside
   * the effect, so the effect only ever setStates from an async callback.
   */
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      startLoading();
      setPage(1);
      setSearch(searchInput.trim());
    },
    [searchInput, startLoading],
  );

  const goToPage = useCallback(
    (next: number) => {
      startLoading();
      setPage(next);
    },
    [startLoading],
  );

  async function handleDelete(target: AdminUser) {
    const confirmed = window.confirm(
      `Delete ${target.firstName} ${target.lastName} (${target.email})?`,
    );
    if (!confirmed) return;

    setDeletingId(target.id);
    setError(null);
    try {
      await deleteUser(target.id);
      startLoading();
      setReloadToken((token) => token + 1);
    } catch (cause) {
      // Includes the API's `cannot_delete_self` message.
      setError(toErrorMessage(cause));
    } finally {
      setDeletingId(null);
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

      <form onSubmit={handleSearch} className="flex items-end gap-3 mb-6">
        <Input
          label="Search"
          placeholder="Name or email"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          containerClassName="flex-1 max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

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
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        loading={deletingId === item.id}
                        disabled={item.id === currentUser?.id}
                        icon={<Trash2 className="h-4 w-4" />}
                        iconPosition="left"
                      >
                        Delete
                      </Button>
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
            onClick={() => goToPage(Math.max(1, page - 1))}
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
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
