import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive, GripVertical, Globe, Pencil, Star, Trash2 } from "lucide-react";
import type { AdminReview } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { Badge, IconButton, TD, TR } from "@/admin/components/ui";

interface SortableReviewRowProps {
  readonly review: AdminReview;
  readonly isTogglingPublished: boolean;
  readonly onTogglePublished: (review: AdminReview) => void;
  readonly onEdit: (review: AdminReview) => void;
  readonly onDelete: (review: AdminReview) => void;
}

/** One draggable row — only the grip handle starts a drag, so the other actions stay ordinary clicks. */
export default function SortableReviewRow({
  review,
  isTogglingPublished,
  onTogglePublished,
  onEdit,
  onDelete,
}: SortableReviewRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: review.id });

  return (
    <TR
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <TD className="w-10">
        <button
          type="button"
          aria-label={`Reorder “${review.name}”'s review`}
          className="cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TD>
      <TD className="max-w-sm">
        <span className="block text-text-primary font-medium truncate">
          {review.name}
        </span>
        <span className="block text-text-muted text-xs truncate">
          {review.position ? `${review.position} · ` : ""}
          {review.country}
        </span>
        <span className="block text-text-secondary text-xs truncate mt-1">
          {review.reviewText}
        </span>
      </TD>
      <TD variant="nowrap">
        <span className="flex items-center gap-1 text-text-secondary">
          <Star
            className="h-3.5 w-3.5 fill-current text-primary-400"
            aria-hidden="true"
          />
          {review.rating}
        </span>
      </TD>
      <TD>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={review.isPublished ? "success" : "neutral"}>
            {review.isPublished ? "Published" : "Pending"}
          </Badge>
          {review.isFeatured && <Badge tone="brand">Featured</Badge>}
        </div>
      </TD>
      <TD variant="nowrap">{formatDate(review.createdAt)}</TD>
      <TD>
        <div className="flex items-center justify-end gap-1">
          <IconButton
            icon={
              review.isPublished ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )
            }
            label={
              review.isPublished
                ? `Unpublish “${review.name}”`
                : `Publish “${review.name}”`
            }
            onClick={() => onTogglePublished(review)}
            disabled={isTogglingPublished}
            className={review.isPublished ? "text-primary-500 hover:text-primary-400" : ""}
          />
          <IconButton
            icon={<Pencil className="h-4 w-4" />}
            label={`Edit “${review.name}”`}
            onClick={() => onEdit(review)}
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Delete “${review.name}”`}
            onClick={() => onDelete(review)}
            tone="danger"
          />
        </div>
      </TD>
    </TR>
  );
}
