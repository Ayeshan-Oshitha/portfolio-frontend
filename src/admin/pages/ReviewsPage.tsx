import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import Badge from "@/client/components/ui/Badge";
import Button from "@/admin/components/ui/Button";
import Spinner from "@/client/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
import ReviewFormModal from "@/admin/components/reviews/ReviewFormModal";
import {
  useDeleteReview,
  useReorderReviews,
  useReviews,
  useUpdateReview,
} from "@/admin/hooks/useReviews";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminReview, ReviewWriteRequest } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";

const PAGE_SIZE = 20;

/** `""` means "drafts and published"; the API takes a bool or nothing. */
type StatusFilter = "" | "published" | "pending";

const STATUS_OPTIONS = [
  { value: "", label: "All reviews" },
  { value: "published", label: "Published" },
  { value: "pending", label: "Pending" },
] as const;

function toIsPublished(status: StatusFilter): boolean | undefined {
  if (status === "published") return true;
  if (status === "pending") return false;
  return undefined;
}

/** PUT is a full replacement, so a quick toggle still has to send every field. */
function toWriteRequest(review: AdminReview): ReviewWriteRequest {
  return {
    name: review.name,
    country: review.country,
    countryCode: review.countryCode,
    position: review.position,
    rating: review.rating,
    reviewText: review.reviewText,
    isPublished: review.isPublished,
    isFeatured: review.isFeatured,
    sortOrder: review.sortOrder,
  };
}

export default function ReviewsPage() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [country, setCountry] = useSearchParamState<string>("country", "");
  const [status, setStatus] = useSearchParamState<StatusFilter>("status", "");
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useReviews({
    search,
    country: country || undefined,
    isPublished: toIsPublished(status),
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteReviewMutation = useDeleteReview();
  const reorderReviewsMutation = useReorderReviews();
  const updateReviewMutation = useUpdateReview();

  const error = queryError ? toErrorMessage(queryError) : null;
  const rows = result?.items ?? [];

  /**
   * Sends the whole page renumbered densely from the index rather than just the
   * two swapped rows, so the numbering stays contiguous however it started.
   * Reviews aren't split per site, so this always applies (unlike FAQs/articles).
   */
  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await reorderReviewsMutation.mutateAsync({
        items: next.map((review, at) => ({
          id: review.id,
          // Page 2 continues where page 1 left off, so the offset matters.
          sortOrder: (page - 1) * PAGE_SIZE + at,
        })),
      });
      toast.success("Order updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  async function togglePublished(review: AdminReview) {
    setTogglingId(review.id);
    try {
      await updateReviewMutation.mutateAsync({
        id: review.id,
        body: { ...toWriteRequest(review), isPublished: !review.isPublished },
      });
      toast.success(review.isPublished ? "Review unpublished." : "Review published.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminReview) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminReview) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteReviewMutation.mutateAsync(deleteTarget.id);
      toast.success("Review deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isReordering = reorderReviewsMutation.isPending;

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Reviews</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "review" : "reviews"} — public submissions
            land unpublished until approved here.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New review
        </Button>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <Input
          label="Search"
          placeholder="Name or review text"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Input
          label="Country"
          placeholder="e.g. United States"
          value={country}
          onChange={(event) => {
            setPage(1);
            setCountry(event.target.value);
          }}
          containerClassName="w-48"
        />

        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as StatusFilter);
          }}
          containerClassName="w-44"
        />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading reviews" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No reviews match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-900/40 text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0 hover:bg-surface-800/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 max-w-sm">
                      <span className="block text-text-primary font-medium truncate">
                        {item.name}
                      </span>
                      <span className="block text-text-muted text-xs truncate">
                        {item.position ? `${item.position} · ` : ""}
                        {item.country}
                      </span>
                      <span className="block text-text-secondary text-xs truncate mt-1">
                        {item.reviewText}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-text-secondary">
                        <Star
                          className="h-3.5 w-3.5 fill-current text-primary-400"
                          aria-hidden="true"
                        />
                        {item.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={item.isPublished ? "subtle" : "outline"}>
                          {item.isPublished ? "Published" : "Pending"}
                        </Badge>
                        {item.isFeatured && (
                          <Badge variant="subtle">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={isReordering || index === 0}
                          aria-label={`Move “${item.name}”'s review up`}
                          title="Move up"
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={isReordering || index === rows.length - 1}
                          aria-label={`Move “${item.name}”'s review down`}
                          title="Move down"
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(item)}
                          loading={togglingId === item.id}
                        >
                          {item.isPublished ? "Unpublish" : "Publish"}
                        </Button>
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
        <ReviewFormModal
          key={editing?.id ?? "new"}
          review={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete review"
        message={
          deleteTarget
            ? `Delete the review from “${deleteTarget.name}”? It disappears from both public sites straight away.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteReviewMutation.isPending}
      />
    </div>
  );
}
