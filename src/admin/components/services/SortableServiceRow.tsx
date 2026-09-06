import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Star } from "lucide-react";
import type { AdminService, Site } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableServiceRowProps {
  readonly service: AdminService;
  /** Which column this row is rendered in — both icons act on this site only. */
  readonly site: Site;
  readonly isTogglingShow: boolean;
  readonly isTogglingFeatured: boolean;
  readonly onToggleShow: (service: AdminService, site: Site) => void;
  readonly onToggleFeatured: (service: AdminService, site: Site) => void;
}

/**
 * One draggable row inside a site's reorder column — same shape as
 * `SortableArticleRow`/`SortableProjectRow`.
 */
export default function SortableServiceRow({
  service,
  site,
  isTogglingShow,
  isTogglingFeatured,
  onToggleShow,
  onToggleFeatured,
}: SortableServiceRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: service.id });

  const shown = site === "agency" ? service.showOnAgency : service.showOnPersonal;
  const featured =
    site === "agency" ? service.featuredOnAgency : service.featuredOnPersonal;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center gap-2 border-b border-border-subtle/70 px-3 py-2.5 last:border-0 hover:bg-surface-800/50 transition-colors duration-150"
    >
      <button
        type="button"
        aria-label={`Reorder “${service.name}”`}
        className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {service.name}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          icon={
            shown ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
          label={
            shown
              ? `Hide “${service.name}” on this site`
              : `Show “${service.name}” on this site`
          }
          onClick={() => onToggleShow(service, site)}
          disabled={isTogglingShow}
          className={`h-7 w-7 ${shown ? "text-primary-500 hover:text-primary-400" : ""}`}
        />
        <IconButton
          icon={<Star className="h-4 w-4" fill={featured ? "currentColor" : "none"} />}
          label={
            featured
              ? `Unfeature “${service.name}” on this site`
              : `Feature “${service.name}” on this site`
          }
          onClick={() => onToggleFeatured(service, site)}
          disabled={isTogglingFeatured || !shown}
          className={`h-7 w-7 ${featured ? "text-warning-400 hover:text-warning-300" : ""}`}
        />
      </div>
    </div>
  );
}
