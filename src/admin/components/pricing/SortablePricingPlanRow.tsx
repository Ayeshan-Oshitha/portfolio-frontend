import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive, GripVertical, Globe, Pencil, Trash2 } from "lucide-react";
import type { AdminPricingPlan } from "@/admin/types";
import { formatDelivery, formatPrice } from "@/admin/utils/format";
import { Badge, IconButton, TD, TR } from "@/admin/components/ui";

interface SortablePricingPlanRowProps {
  readonly plan: AdminPricingPlan;
  readonly serviceName: (id?: string) => string;
  readonly isPublishing: boolean;
  readonly onTogglePublished: (plan: AdminPricingPlan) => void;
  readonly onEdit: (plan: AdminPricingPlan) => void;
  readonly onDelete: (plan: AdminPricingPlan) => void;
}

/** One draggable row — only the grip handle starts a drag, so the other actions stay ordinary clicks. */
export default function SortablePricingPlanRow({
  plan,
  serviceName,
  isPublishing,
  onTogglePublished,
  onEdit,
  onDelete,
}: SortablePricingPlanRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: plan.id });

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
          aria-label={`Reorder “${plan.name}”`}
          className="cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TD>
      <TD>
        <span className="block text-text-primary font-medium">{plan.name}</span>
        {plan.tagline && (
          <span className="block text-text-muted text-xs">{plan.tagline}</span>
        )}
      </TD>
      <TD>
        {plan.serviceId ? (
          <Badge variant="outline">{serviceName(plan.serviceId)}</Badge>
        ) : (
          <Badge tone="brand">Combo pack</Badge>
        )}
      </TD>
      <TD variant="nowrap">{formatPrice(plan)}</TD>
      <TD variant="nowrap">{formatDelivery(plan)}</TD>
      <TD>{plan.features.length}</TD>
      <TD>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={plan.isPublished ? "success" : "neutral"}>
            {plan.isPublished ? "Published" : "Draft"}
          </Badge>
          {plan.isPopular && <Badge variant="outline">Popular</Badge>}
          {plan.featured && <Badge tone="brand">Featured</Badge>}
        </div>
      </TD>
      <TD>
        <div className="flex items-center justify-end gap-1">
          <IconButton
            icon={
              plan.isPublished ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )
            }
            label={plan.isPublished ? `Unpublish “${plan.name}”` : `Publish “${plan.name}”`}
            onClick={() => onTogglePublished(plan)}
            disabled={isPublishing}
            className={plan.isPublished ? "text-primary-500 hover:text-primary-400" : ""}
          />
          <IconButton
            icon={<Pencil className="h-4 w-4" />}
            label={`Edit “${plan.name}”`}
            onClick={() => onEdit(plan)}
          />
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Delete “${plan.name}”`}
            onClick={() => onDelete(plan)}
            tone="danger"
          />
        </div>
      </TD>
    </TR>
  );
}
