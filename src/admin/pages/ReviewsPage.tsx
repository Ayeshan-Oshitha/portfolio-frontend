import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
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
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
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
      toast.success(
        review.isPublished ? "Review unpublished." : "Review published.",
      );
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
      <PageHeader
        title="Reviews"
        description={`${total} ${total === 1 ? "review" : "reviews"} — public submissions land unpublished until approved here.`}
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New review
          </Button>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
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
          fieldSize="sm"
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
          fieldSize="sm"
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as StatusFilter);
          }}
          containerClassName="w-44"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyTitle="No reviews found"
          emptyDescription="No reviews match these filters."
        >
          <Table>
            <THead>
              <TH>Reviewer</TH>
              <TH>Rating</TH>
              <TH>Status</TH>
              <TH>Submitted</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item, index) => (
                <TR key={item.id}>
                  <TD className="max-w-sm">
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
                  </TD>
                  <TD variant="nowrap">
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Star
                        className="h-3.5 w-3.5 fill-current text-primary-400"
                        aria-hidden="true"
                      />
                      {item.rating}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={item.isPublished ? "success" : "neutral"}>
                        {item.isPublished ? "Published" : "Pending"}
                      </Badge>
                      {item.isFeatured && <Badge tone="brand">Featured</Badge>}
                    </div>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.createdAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<ArrowUp className="h-4 w-4" />}
                        label={`Move “${item.name}”'s review up`}
                        onClick={() => move(index, -1)}
                        disabled={isReordering || index === 0}
                      />
                      <IconButton
                        icon={<ArrowDown className="h-4 w-4" />}
                        label={`Move “${item.name}”'s review down`}
                        onClick={() => move(index, 1)}
                        disabled={isReordering || index === rows.length - 1}
                      />

                      <IconButton
                        icon={
                          item.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )
                        }
                        label={
                          item.isPublished
                            ? `Unpublish “${item.name}”`
                            : `Publish “${item.name}”`
                        }
                        onClick={() => togglePublished(item)}
                        disabled={togglingId === item.id}
                      />
                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.name}”`}
                        onClick={() => openEdit(item)}
                      />
                      <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        label={`Delete “${item.name}”`}
                        onClick={() => askDelete(item)}
                        tone="danger"
                      />
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
