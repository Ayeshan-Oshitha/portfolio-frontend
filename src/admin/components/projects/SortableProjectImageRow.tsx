import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Star, Trash2 } from "lucide-react";
import type { ProjectImage } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableProjectImageRowProps {
  readonly image: ProjectImage;
  readonly busy: boolean;
  readonly onEditAltText: (image: ProjectImage) => void;
  readonly onMakePrimary: (image: ProjectImage) => void;
  readonly onDelete: (image: ProjectImage) => void;
}

/** One gallery card — only the grip handle starts a drag, so the row actions stay ordinary clicks. */
export default function SortableProjectImageRow({
  image,
  busy,
  onEditAltText,
  onMakePrimary,
  onDelete,
}: SortableProjectImageRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: image.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center gap-4 rounded-lg border border-border-subtle p-3"
    >
      <button
        type="button"
        aria-label={`Reorder “${image.altText}”`}
        className="cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <img
        src={image.url}
        alt={image.altText}
        className="h-16 w-16 rounded-md object-cover shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-text-primary">{image.altText}</p>
        <p className="text-xs text-text-muted">
          {image.width}×{image.height}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <IconButton
          icon={<Pencil className="h-4 w-4" />}
          label="Edit alt text"
          onClick={() => onEditAltText(image)}
          disabled={busy}
        />
        <IconButton
          icon={
            <Star
              className={`h-4 w-4 ${image.isPrimary ? "fill-current" : ""}`}
            />
          }
          label={image.isPrimary ? "Primary image" : "Make primary"}
          onClick={() => onMakePrimary(image)}
          disabled={busy || image.isPrimary}
          className={image.isPrimary ? "!text-primary-400 disabled:!opacity-100" : ""}
        />
        <IconButton
          icon={<Trash2 className="h-4 w-4" />}
          label="Delete image"
          onClick={() => onDelete(image)}
          disabled={busy}
          tone="danger"
        />
      </div>
    </li>
  );
}
