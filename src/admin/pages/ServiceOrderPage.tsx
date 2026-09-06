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
import SortableServiceRow from "@/admin/components/services/SortableServiceRow";
import {
  useReorderServices,
  useServices,
  useUpdateService,
} from "@/admin/hooks/useServices";
import { serviceKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminService, PagedResult, ServiceWriteRequest, Site } from "@/admin/types";
import { BackLink, Card, DataTableShell, PageHeader } from "@/admin/components/ui";

// Well above any realistic service count so a column never needs pagination
// to reorder — this screen is for arranging, not browsing.
const COLUMN_PAGE_SIZE = 100;

/** PUT is a full replacement, so a toggle from this screen still has to send every field. */
function toWriteRequest(service: AdminService): ServiceWriteRequest {
  return {
    name: service.name,
    slug: service.slug,
    shortDescription: service.shortDescription,
    eyebrow: service.eyebrow,
    headline: service.headline,
    deck: service.deck,
    whoThisIsFor: service.whoThisIsFor,
    outcomes: service.outcomes,
    capabilities: service.capabilities,
    inDepth: service.inDepth,
    primaryCtaLabel: service.primaryCtaLabel,
    primaryCtaUrl: service.primaryCtaUrl,
    secondaryCtaLabel: service.secondaryCtaLabel,
    secondaryCtaUrl: service.secondaryCtaUrl,
    iconObjectKey: service.iconObjectKey,
    iconUrl: service.iconUrl,
    iconWidth: service.iconWidth,
    iconHeight: service.iconHeight,
    iconAltText: service.iconAltText,
    heroImageObjectKey: service.heroImageObjectKey,
    heroImageUrl: service.heroImageUrl,
    heroImageWidth: service.heroImageWidth,
    heroImageHeight: service.heroImageHeight,
    heroImageAltText: service.heroImageAltText,
    depthImageObjectKey: service.depthImageObjectKey,
    depthImageUrl: service.depthImageUrl,
    depthImageWidth: service.depthImageWidth,
    depthImageHeight: service.depthImageHeight,
    depthImageAltText: service.depthImageAltText,
    projectIds: service.projects.map((project) => project.id),
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    isPublished: service.isPublished,
    showOnAgency: service.showOnAgency,
    featuredOnAgency: service.featuredOnAgency,
    agencySortOrder: service.agencySortOrder,
    showOnPersonal: service.showOnPersonal,
    featuredOnPersonal: service.featuredOnPersonal,
    personalSortOrder: service.personalSortOrder,
  };
}

function sortOrderFor(service: AdminService, site: Site): number {
  return site === "agency" ? service.agencySortOrder : service.personalSortOrder;
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

  // Only published services can be dragged, featured, shown or hidden here —
  // a draft has nothing to arrange on a public site yet. Publishing itself
  // stays on the main list; once it happens the service shows up here —
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
  } = useServices(queryParams);
  const reorderServicesMutation = useReorderServices();
  const updateServiceMutation = useUpdateService();

  const error = queryError ? toErrorMessage(queryError) : null;
  // The admin list is ordered alphabetically, not this site's sort order, so
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
   * back while the request is in flight — same pattern as the FAQ/Review/
   * Article reorder screens. Rolls back on failure.
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((service) => service.id === active.id);
    const toIndex = rows.findIndex((service) => service.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((service, at) => ({ id: service.id, sortOrder: at }));

    const queryKey = serviceKeys.list(queryParams);
    const previous = queryClient.getQueryData<PagedResult<AdminService>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminService> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((service, at) =>
            site === "agency"
              ? { ...service, agencySortOrder: items[at].sortOrder }
              : { ...service, personalSortOrder: items[at].sortOrder },
          ),
        },
    );

    try {
      await reorderServicesMutation.mutateAsync({ site, items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  /**
   * Both site columns' queries return the same underlying published services
   * once `includeHidden` is in play, so a toggle has to patch every cached
   * list — not just this column's — or the other column would briefly
   * re-render with the pre-toggle value before the background refetch lands.
   */
  function patchServiceInCaches(serviceId: string, patch: Partial<AdminService>) {
    queryClient.setQueriesData<PagedResult<AdminService>>(
      { queryKey: serviceKeys.lists() },
      (old) =>
        old && {
          ...old,
          items: old.items.map((item) =>
            item.id === serviceId ? { ...item, ...patch } : item,
          ),
        },
    );
  }

  async function toggleFeatured(service: AdminService, targetSite: Site) {
    setTogglingId(service.id);
    const patch: Partial<AdminService> =
      targetSite === "agency"
        ? { featuredOnAgency: !service.featuredOnAgency }
        : { featuredOnPersonal: !service.featuredOnPersonal };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminService>>({
      queryKey: serviceKeys.lists(),
    });
    patchServiceInCaches(service.id, patch);

    try {
      await updateServiceMutation.mutateAsync({
        id: service.id,
        body: { ...toWriteRequest(service), ...patch },
      });
      toast.success("Featured updated.");
    } catch (cause) {
      previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  async function toggleShow(service: AdminService, targetSite: Site) {
    setTogglingId(service.id);
    const patch: Partial<AdminService> =
      targetSite === "agency"
        ? {
            showOnAgency: !service.showOnAgency,
            // Turning "show" off also turns "featured" off — can't be featured while hidden.
            featuredOnAgency: service.showOnAgency ? false : service.featuredOnAgency,
          }
        : {
            showOnPersonal: !service.showOnPersonal,
            featuredOnPersonal: service.showOnPersonal ? false : service.featuredOnPersonal,
          };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminService>>({
      queryKey: serviceKeys.lists(),
    });
    patchServiceInCaches(service.id, patch);

    try {
      await updateServiceMutation.mutateAsync({
        id: service.id,
        body: { ...toWriteRequest(service), ...patch },
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
            Showing the first {COLUMN_PAGE_SIZE} published services on this site.
          </p>
        )}
      </div>
      {/*
        `isFetching` deliberately isn't wired to the spinner here: every
        toggle on this page (show/feature) invalidates the list and triggers
        a background refetch, and swapping the whole column out for a
        spinner on every click is the exact flicker already fixed for
        drag-and-drop elsewhere. The initial load still shows it via `isLoading`.
      */}
      <DataTableShell
        error={error}
        isLoading={isLoading}
        isEmpty={rows.length === 0}
        emptyTitle="No published services"
        emptyDescription="Publish a service from the Services list to arrange and show it here."
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((service) => service.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((service) => (
              <SortableServiceRow
                key={service.id}
                service={service}
                site={site}
                isTogglingShow={togglingId === service.id && updateServiceMutation.isPending}
                isTogglingFeatured={
                  togglingId === service.id && updateServiceMutation.isPending
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
 * Dedicated reorder + visibility screen: a service carries two independent
 * sort orders plus a show/featured pair per site, so a single in-table drag
 * list isn't enough — each site gets its own drag-sortable column, side by
 * side, with the show/feature controls that used to live on the edit form.
 */
export default function ServiceOrderPage() {
  return (
    <div>
      <BackLink to="/admin/services">Services</BackLink>

      <PageHeader
        title="Reorder & visibility"
        description="Only published services are shown. Drag by the handle to set each site's order, and use the icons to show or feature one on that site."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteColumn site="agency" title="Agency site" />
        <SiteColumn site="personal" title="Personal site" />
      </div>
    </div>
  );
}
