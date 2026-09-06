import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { AdminCertificate } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { Badge, IconButton, TD, TR } from "@/admin/components/ui";

interface SortableCertificateRowProps {
  readonly certificate: AdminCertificate;
  readonly onEdit: (certificate: AdminCertificate) => void;
  readonly onDelete: (certificate: AdminCertificate) => void;
}

/** One draggable row — only the grip handle starts a drag, so Edit/Delete stay ordinary clicks. */
export default function SortableCertificateRow({
  certificate,
  onEdit,
  onDelete,
}: SortableCertificateRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: certificate.id });

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
          aria-label={`Reorder “${certificate.name}”`}
          className="cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TD>
      <TD className="max-w-sm">
        <span className="block text-text-primary font-medium truncate">
          {certificate.name}
        </span>
      </TD>
      <TD>{certificate.issuedBy}</TD>
      <TD variant="nowrap">{certificate.issuedDate}</TD>
      <TD>
        <Badge tone={certificate.featured ? "brand" : "neutral"}>
          {certificate.featured ? "Featured" : "—"}
        </Badge>
      </TD>
      <TD>
        <Badge tone={certificate.isPublished ? "success" : "neutral"}>
          {certificate.isPublished ? "Published" : "Draft"}
        </Badge>
      </TD>
      <TD variant="nowrap">{formatDate(certificate.updatedAt)}</TD>
      <TD>
        <div className="flex items-center justify-end gap-1">
          <IconButton
            icon={<Pencil className="h-4 w-4" />}
            label={`Edit “${certificate.name}”`}
            onClick={() => onEdit(certificate)}
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Delete “${certificate.name}”`}
            onClick={() => onDelete(certificate)}
            tone="danger"
          />
        </div>
      </TD>
    </TR>
  );
}
