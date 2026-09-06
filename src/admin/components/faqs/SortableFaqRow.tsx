import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { AdminFaq } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { Badge, IconButton, TD, TR } from "@/admin/components/ui";

interface SortableFaqRowProps {
  readonly faq: AdminFaq;
  readonly onEdit: (faq: AdminFaq) => void;
  readonly onDelete: (faq: AdminFaq) => void;
}

/** One draggable row — only the grip handle starts a drag, so Edit/Delete stay ordinary clicks. */
export default function SortableFaqRow({
  faq,
  onEdit,
  onDelete,
}: SortableFaqRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: faq.id });

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
          aria-label={`Reorder “${faq.question}”`}
          className="cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TD>
      <TD className="max-w-sm">
        <span className="block text-text-primary font-medium truncate">
          {faq.question}
        </span>
      </TD>
      <TD>
        <Badge tone={faq.serviceId ? "brand" : "neutral"}>
          {faq.serviceId ? faq.serviceName : "Global"}
        </Badge>
      </TD>
      <TD>
        <Badge tone={faq.isPublished ? "success" : "neutral"}>
          {faq.isPublished ? "Published" : "Draft"}
        </Badge>
      </TD>
      <TD variant="nowrap">{formatDate(faq.updatedAt)}</TD>
      <TD>
        <div className="flex items-center justify-end gap-1">
          <IconButton
            icon={<Pencil className="h-4 w-4" />}
            label={`Edit “${faq.question}”`}
            onClick={() => onEdit(faq)}
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Delete “${faq.question}”`}
            onClick={() => onDelete(faq)}
            tone="danger"
          />
        </div>
      </TD>
    </TR>
  );
}
