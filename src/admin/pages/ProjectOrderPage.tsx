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
import SortableProjectRow from "@/admin/components/projects/SortableProjectRow";
import {
  useProjects,
  useReorderProjects,
  useUpdateProject,
} from "@/admin/hooks/useProjects";
import { projectKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminProject, PagedResult, ProjectWriteRequest, Site } from "@/admin/types";
import { BackLink, Card, DataTableShell, PageHeader } from "@/admin/components/ui";

// Well above any realistic project count so a column never needs pagination
// to reorder — this screen is for arranging, not browsing.
const COLUMN_PAGE_SIZE = 100;

/** PUT is a full replacement, so a toggle from this screen still has to send every field. */
function toWriteRequest(project: AdminProject): ProjectWriteRequest {
  return {
    title: project.title,
    slug: project.slug,
    year: project.year,
    shortDescription: project.shortDescription,
    description: project.description,
    websiteUrl: project.websiteUrl,
    problem: project.problem,
    solution: project.solution,
    whatWeDelivered: project.whatWeDelivered,
    proof: project.proof,
    clientName: project.clientName,
    isPublished: project.isPublished,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    showOnAgency: project.showOnAgency,
    featuredOnAgency: project.featuredOnAgency,
    showOnPersonal: project.showOnPersonal,
    featuredOnPersonal: project.featuredOnPersonal,
    tagIds: project.tags.map((tag) => tag.id),
  };
}

function sortOrderFor(project: AdminProject, site: Site): number {
  return site === "agency" ? project.agencySortOrder : project.personalSortOrder;
}

interface SiteColumnProps {
  readonly site: Site;
  readonly title: string;
}

/**
 * One site's drag-sortable list, with its own query and its own `DndContext`
 * so dragging one column never touches the other's cache entry.
 */
function SiteColumn({ site, title }: SiteColumnProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Only published projects can be dragged, featured, shown or hidden here —
  // a draft has nothing to arrange on a public site yet. Publishing itself
  // stays on the editor page; once it happens the project shows up here —
  // `includeHidden` is what makes that true even before it's been shown on
  // this particular site, since this is the screen that turns showing on.
  const queryParams = {
    site,
    isPublished: true,
    includeHidden: true,
    pageSize: COLUMN_PAGE_SIZE,
  };
  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useProjects(queryParams);
  const reorderProjectsMutation = useReorderProjects();
  const updateProjectMutation = useUpdateProject();

  const error = queryError ? toErrorMessage(queryError) : null;
  // The admin list is ordered by year/title, not this site's sort order, so
  // the column re-sorts client side.
  const rows = [...(result?.items ?? [])].sort(
    (a, b) => sortOrderFor(a, site) - sortOrderFor(b, site),
  );
  const atCap = (result?.total ?? 0) > COLUMN_PAGE_SIZE;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /**
   * Optimistically writes the dropped order into this column's cache entry
   * before the request resolves, so the row stays put instead of snapping
   * back while the request is in flight — same pattern as the Article
   * reorder screen. Rolls back on failure.
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((project) => project.id === active.id);
    const toIndex = rows.findIndex((project) => project.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((project, at) => ({ id: project.id, sortOrder: at }));

    const queryKey = projectKeys.list(queryParams);
    const previous = queryClient.getQueryData<PagedResult<AdminProject>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminProject> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((project, at) =>
            site === "agency"
              ? { ...project, agencySortOrder: items[at].sortOrder }
              : { ...project, personalSortOrder: items[at].sortOrder },
          ),
        },
    );

    try {
      await reorderProjectsMutation.mutateAsync({ site, items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  /**
   * Both site columns' queries return the same underlying published projects
   * once `includeHidden` is in play, so a toggle has to patch every cached
   * list — not just this column's — or the other column (and this one, once
   * `updateProjectMutation`'s own `invalidateQueries` kicks in a moment
   * later) would briefly re-render with the pre-toggle value before the
   * background refetch lands. Writing the patch into every matching cache
   * entry immediately is what keeps the flip from visibly reverting and
   * re-applying itself.
   */
  function patchProjectInCaches(projectId: string, patch: Partial<AdminProject>) {
    queryClient.setQueriesData<PagedResult<AdminProject>>(
      { queryKey: projectKeys.lists() },
      (old) =>
        old && {
          ...old,
          items: old.items.map((item) =>
            item.id === projectId ? { ...item, ...patch } : item,
          ),
        },
    );
  }

  async function toggleFeatured(project: AdminProject, targetSite: Site) {
    setTogglingId(project.id);
    const patch: Partial<AdminProject> =
      targetSite === "agency"
        ? { featuredOnAgency: !project.featuredOnAgency }
        : { featuredOnPersonal: !project.featuredOnPersonal };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProject>>({
      queryKey: projectKeys.lists(),
    });
    patchProjectInCaches(project.id, patch);

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        body: { ...toWriteRequest(project), ...patch },
      });
      toast.success("Featured updated.");
    } catch (cause) {
      previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  async function toggleShow(project: AdminProject, targetSite: Site) {
    setTogglingId(project.id);
    const patch: Partial<AdminProject> =
      targetSite === "agency"
        ? {
            showOnAgency: !project.showOnAgency,
            // Turning "show" off also turns "featured" off — can't be featured while hidden.
            featuredOnAgency: project.showOnAgency ? false : project.featuredOnAgency,
          }
        : {
            showOnPersonal: !project.showOnPersonal,
            featuredOnPersonal: project.showOnPersonal ? false : project.featuredOnPersonal,
          };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProject>>({
      queryKey: projectKeys.lists(),
    });
    patchProjectInCaches(project.id, patch);

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        body: { ...toWriteRequest(project), ...patch },
      });
      toast.success("Visibility updated.");
    } catch (cause) {
      previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-border-subtle px-6 py-4">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {atCap && (
          <p className="mt-1 text-xs text-text-muted">
            Showing the first {COLUMN_PAGE_SIZE} published projects on this site.
          </p>
        )}
      </div>
      {/*
        `isFetching` deliberately isn't wired to the spinner here: every
        toggle on this page (show/feature) invalidates the list and triggers
        a background refetch, and swapping the whole column out for a
        spinner on every click is the exact flicker that was already fixed
        for drag-and-drop elsewhere. The initial load still shows it via
        `isLoading`.
      */}
      <DataTableShell
        error={error}
        isLoading={isLoading}
        isEmpty={rows.length === 0}
        emptyTitle="No published projects"
        emptyDescription="Publish a project from its editor to arrange and show it here."
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((project) => project.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((project) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                site={site}
                isTogglingShow={togglingId === project.id && updateProjectMutation.isPending}
                isTogglingFeatured={
                  togglingId === project.id && updateProjectMutation.isPending
                }
                onToggleShow={toggleShow}
                onToggleFeatured={toggleFeatured}
              />
            ))}
          </SortableContext>
        </DndContext>
      </DataTableShell>
    </Card>
  );
}

/**
 * Dedicated reorder + visibility screen: a project carries two independent
 * sort orders plus a show/featured pair per site, so a single in-table drag
 * list isn't enough — each site gets its own drag-sortable column, side by
 * side, with the show/feature controls that used to live on the editor form.
 */
export default function ProjectOrderPage() {
  return (
    <div>
      <BackLink to="/admin/projects">Projects</BackLink>

      <PageHeader
        title="Reorder & visibility"
        description="Only published projects are shown. Drag by the handle to set each site's order, and use the icons to show or feature one on that site."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteColumn site="agency" title="Agency site" />
        <SiteColumn site="personal" title="Personal site" />
      </div>
    </div>
  );
}
