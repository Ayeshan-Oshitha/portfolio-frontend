import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Star } from "lucide-react";
import type { AdminArticle, Site } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableArticleRowProps {
  readonly article: AdminArticle;
  /** Which column this row is rendered in — both icons act on this site only. */
  readonly site: Site;
  readonly isTogglingShow: boolean;
  readonly isTogglingFeatured: boolean;
  readonly onToggleShow: (article: AdminArticle, site: Site) => void;
  readonly onToggleFeatured: (article: AdminArticle, site: Site) => void;
}

/**
 * One draggable row inside a site's reorder column. A plain flex row rather
 * than `Table`/`TD` — the shared table cells' `px-6` padding is sized for
 * full-width list pages, and this screen needs two icon buttons to fit
 * inside one half of a two-column grid without scrolling. Only the grip
 * handle starts a drag, so the toggle icons stay ordinary clicks — same
 * split `SortableFaqRow`/`SortableReviewRow` use.
 *
 * Publish/unpublish is global and lives on the editor page only, not here —
 * this screen only ever lists published articles, so there's no draft badge
 * to show either.
 */
export default function SortableArticleRow({
  article,
  site,
  isTogglingShow,
  isTogglingFeatured,
  onToggleShow,
  onToggleFeatured,
}: SortableArticleRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: article.id });

  const shown = site === "agency" ? article.showOnAgency : article.showOnPersonal;
  const featured =
    site === "agency" ? article.featuredOnAgency : article.featuredOnPersonal;

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
        aria-label={`Reorder “${article.title}”`}
        className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {article.title}
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
              ? `Hide “${article.title}” on this site`
              : `Show “${article.title}” on this site`
          }
          onClick={() => onToggleShow(article, site)}
          disabled={isTogglingShow}
          className={`h-7 w-7 ${shown ? "text-primary-500 hover:text-primary-400" : ""}`}
        />
        <IconButton
          icon={<Star className="h-4 w-4" fill={featured ? "currentColor" : "none"} />}
          label={
            featured
              ? `Unfeature “${article.title}” on this site`
              : `Feature “${article.title}” on this site`
          }
          onClick={() => onToggleFeatured(article, site)}
          disabled={isTogglingFeatured || !shown}
          className={`h-7 w-7 ${featured ? "text-warning-400 hover:text-warning-300" : ""}`}
        />
      </div>
    </div>
  );
}
