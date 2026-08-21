import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import FaqFormModal from "@/admin/components/faqs/FaqFormModal";
import { useDeleteFaq, useFaqs } from "@/admin/hooks/useFaqs";
import { toErrorMessage } from "@/admin/api/ApiError";
import type { AdminFaq } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";

const PAGE_SIZE = 20;

export default function FaqsPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput);
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useFaqs({ search, page, pageSize: PAGE_SIZE });
  const deleteFaqMutation = useDeleteFaq();

  const error = queryError ? toErrorMessage(queryError) : null;

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminFaq) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminFaq) {
    setDeleteTarget(target);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteError(null);
    try {
      await deleteFaqMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (cause) {
      setDeleteError(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">FAQs</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "question" : "questions"} shown across both
            sites.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New FAQ
        </Button>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <Input
          label="Search"
          placeholder="Question"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading FAQs" />
          </div>
        ) : !result || result.items.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No FAQs match this search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0"
                  >
                    <td className="px-6 py-4 max-w-sm">
                      <span className="block text-text-primary font-medium truncate">
                        {item.question}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.category ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.isPublished ? "subtle" : "outline"}>
                        {item.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(item)}
                          icon={<Pencil className="h-4 w-4" />}
                          iconPosition="left"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => askDelete(item)}
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

      {/* Keyed so switching rows remounts the form with fresh defaults. */}
      {isFormOpen && (
        <FaqFormModal
          key={editing?.id ?? "new"}
          faq={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete FAQ"
        message={
          deleteTarget ? `Delete “${deleteTarget.question}”?` : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteFaqMutation.isPending}
        error={deleteError}
      />
    </div>
  );
}
