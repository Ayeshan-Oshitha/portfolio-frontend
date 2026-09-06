import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import ReviewFormModal from "@/admin/components/reviews/ReviewFormModal";
import SortableReviewRow from "@/admin/components/reviews/SortableReviewRow";
import {
  useDeleteReview,
  useReorderReviews,
  useReviews,
  useUpdateReview,
} from "@/admin/hooks/useReviews";
import { reviewKeys } from "@/admin/hooks/queryKeys";
import { COUNTRY_OPTIONS } from "@/admin/utils/countries";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminReview, PagedResult, ReviewWriteRequest } from "@/admin/types";
import {
  Button,
  Card,
  Combobox,
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
  };
}

export default function ReviewsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
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

  const queryParams = {
    search,
    country: country || undefined,
    isPublished: toIsPublished(status),
    page,
    pageSize: PAGE_SIZE,
  };

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useReviews(queryParams);
  const deleteReviewMutation = useDeleteReview();
  const reorderReviewsMutation = useReorderReviews();
  const updateReviewMutation = useUpdateReview();

  const error = queryError ? toErrorMessage(queryError) : null;
  const rows = result?.items ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  /**
   * Sends the whole page renumbered densely from the dropped order rather
   * than just the two swapped rows, so the numbering stays contiguous
   * however it started. Reviews aren't split per site, so this always
   * applies (unlike FAQs/articles). Writes the reordered rows into the
   * query cache immediately (before the request resolves) so dnd-kit's
   * already-reordered drop position sticks instead of snapping back while
   * the request is in flight, and rolls back to the pre-drag snapshot on
   * failure.
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((review) => review.id === active.id);
    const toIndex = rows.findIndex((review) => review.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((review, at) => ({
      id: review.id,
      // Page 2 continues where page 1 left off, so the offset matters.
      sortOrder: (page - 1) * PAGE_SIZE + at,
    }));

    const queryKey = reviewKeys.list(queryParams);
    const previous =
      queryClient.getQueryData<PagedResult<AdminReview>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminReview> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((review, at) => ({
            ...review,
            sortOrder: items[at].sortOrder,
          })),
        },
    );

    try {
      await reorderReviewsMutation.mutateAsync({ items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
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

  return (
    <div>
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

        <Combobox
          fieldSize="sm"
          label="Country"
          placeholder="All countries"
          searchPlaceholder="Search countries…"
          options={COUNTRY_OPTIONS}
          allowClear
          value={country}
          onChange={(value) => {
            setPage(1);
            setCountry(value);
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
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No reviews found"
          emptyDescription="No reviews match these filters."
        >
          <Table>
            <THead>
              <TH className="w-10 sr-only">Reorder</TH>
              <TH>Reviewer</TH>
              <TH>Rating</TH>
              <TH>Status</TH>
              <TH>Submitted</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rows.map((review) => review.id)}
                strategy={verticalListSortingStrategy}
              >
                <TBody>
                  {rows.map((item) => (
                    <SortableReviewRow
                      key={item.id}
                      review={item}
                      isTogglingPublished={togglingId === item.id}
                      onTogglePublished={togglePublished}
                      onEdit={openEdit}
                      onDelete={askDelete}
                    />
                  ))}
                </TBody>
              </SortableContext>
            </DndContext>
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
