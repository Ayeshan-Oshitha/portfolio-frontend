import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import ServiceFormModal from "@/admin/components/services/ServiceFormModal";
import {
  useDeleteService,
  useReorderServices,
  useServices,
  useSetServicePublished,
} from "@/admin/hooks/useServices";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminService, Site } from "@/admin/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
  Input,
  PageHeader,
  Select,
  Toolbar,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

/**
 * Reordering renumbers a whole site at once, so it needs the services on one
 * page. 100 is the API's own `pageSize` ceiling.
 */
const REORDER_PAGE_SIZE = 100;

const SITE_OPTIONS = [
  { value: "", label: "Both sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

const PUBLISHED_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
] as const;

function toIsPublished(value: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

/** The site whose order a service carries — reordering is per site. */
function siteSortOrder(service: AdminService, site: Site): number {
  return site === "agency"
    ? service.agencySortOrder
    : service.personalSortOrder;
}

export default function ServicesPage() {
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [site, setSite] = useSearchParamState<Site | "">("site", "");
  const [published, setPublished] = useSearchParamState<string>(
    "published",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [isReordering, setIsReordering] = useState(false);
  const [orderOverride, setOrderOverride] = useState<string[] | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useServices({
    site: site || undefined,
    isPublished: toIsPublished(published),
    search,
    page: isReordering ? 1 : page,
    pageSize: isReordering ? REORDER_PAGE_SIZE : PAGE_SIZE,
  });
  const deleteServiceMutation = useDeleteService();
  const setPublishedMutation = useSetServicePublished();
  const reorderServicesMutation = useReorderServices();

  const error = queryError ? toErrorMessage(queryError) : null;

  /**
   * The API returns services in name order, so the reorder list has to be
   * sorted by the site's own sort order first.
   */
  const sortedForSite = useMemo(() => {
    if (!result || !site) return [];

    return [...result.items].sort(
      (a, b) =>
        siteSortOrder(a, site) - siteSortOrder(b, site) ||
        a.name.localeCompare(b.name),
    );
  }, [result, site]);

  /**
   * Pending moves are held as a list of ids layered over that sorted list
   * rather than as a copy of the rows, so a refetch cannot leave the draft
   * holding stale services. An id list that no longer lines up with the data
   * is dropped, which is the same thing cancelling would do.
   */
  const orderedRows = useMemo(() => {
    if (!orderOverride) return sortedForSite;

    const byId = new Map(sortedForSite.map((service) => [service.id, service]));
    const picked = orderOverride
      .map((id) => byId.get(id))
      .filter((service): service is AdminService => service !== undefined);

    return picked.length === sortedForSite.length ? picked : sortedForSite;
  }, [orderOverride, sortedForSite]);

  function handleSiteChange(next: Site | "") {
    setPage(1);
    setSite(next);
    // Sort order is per site, so a pending reorder cannot outlive the filter.
    setOrderOverride(null);
    if (!next) setIsReordering(false);
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminService) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminService) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteServiceMutation.mutateAsync(deleteTarget.id);
      toast.success("Service deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  async function togglePublished(target: AdminService) {
    setPublishingId(target.id);
    try {
      await setPublishedMutation.mutateAsync({
        id: target.id,
        isPublished: !target.isPublished,
      });
      toast.success(target.isPublished ? "Unpublished." : "Published.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setPublishingId(null);
    }
  }

  function startReorder() {
    if (!site) return;
    setOrderOverride(null);
    setIsReordering(true);
  }

  function cancelReorder() {
    setOrderOverride(null);
    setIsReordering(false);
  }

  function moveDraft(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= orderedRows.length) return;

    const next = orderedRows.map((service) => service.id);
    [next[index], next[target]] = [next[target], next[index]];
    setOrderOverride(next);
  }

  async function saveOrder() {
    if (!site) return;

    try {
      await reorderServicesMutation.mutateAsync({
        site,
        items: orderedRows.map((service, index) => ({
          id: service.id,
          sortOrder: index,
        })),
      });
      toast.success("Order updated.");
      setOrderOverride(null);
      setIsReordering(false);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = isReordering ? orderedRows : (result?.items ?? []);
  const isSavingOrder = reorderServicesMutation.isPending;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Services"
        description={`${total} ${total === 1 ? "service" : "services"} — pricing plans hang off these.`}
        actions={
          isReordering ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelReorder}
                disabled={isSavingOrder}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={saveOrder} loading={isSavingOrder}>
                {isSavingOrder ? "Saving…" : "Save order"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={startReorder}
                disabled={!site}
                icon={<ArrowUpDown className="h-4 w-4" />}
                iconPosition="left"
              >
                Reorder
              </Button>
              <Button
                size="sm"
                onClick={openCreate}
                icon={<Plus className="h-4 w-4" />}
                iconPosition="left"
              >
                New service
              </Button>
            </>
          )
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Service name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          fieldSize="sm"
          label="Site"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) =>
            handleSiteChange(event.target.value as Site | "")
          }
          containerClassName="w-36"
        />

        <Select
          fieldSize="sm"
          label="Status"
          options={PUBLISHED_OPTIONS}
          value={published}
          onChange={(event) => {
            setPage(1);
            setPublished(event.target.value);
          }}
          containerClassName="w-36"
        />
      </Toolbar>

      {isReordering ? (
        <Alert variant="info" className="mb-6">
          Ordering the {site === "agency" ? "agency" : "personal"} site. Moves
          are saved only when you press Save order.
        </Alert>
      ) : (
        !site && (
          <p className="mb-6 text-xs text-text-muted">
            Pick a single site to reorder — sort order is kept per site.
          </p>
        )
      )}

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyTitle="No services found"
          emptyDescription="No services match these filters."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Short description</TH>
              <TH>Sites</TH>
              <TH>Features</TH>
              <TH>Status</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item, index) => (
                <TR key={item.id}>
                  <TD>
                    <span className="block text-text-primary font-medium">
                      {item.name}
                    </span>
                    <span className="block text-text-muted text-xs">
                      /{item.slug}
                    </span>
                  </TD>
                  <TD className="max-w-xs">
                    <span className="line-clamp-2">
                      {item.shortDescription}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.showOnAgency && (
                        <Badge
                          tone={item.featuredOnAgency ? "brand" : "neutral"}
                        >
                          {item.featuredOnAgency ? "Agency ★" : "Agency"}
                        </Badge>
                      )}
                      {item.showOnPersonal && (
                        <Badge
                          tone={item.featuredOnPersonal ? "brand" : "neutral"}
                        >
                          {item.featuredOnPersonal ? "Personal ★" : "Personal"}
                        </Badge>
                      )}
                      {!item.showOnAgency && !item.showOnPersonal && (
                        <span className="text-text-muted text-xs">Hidden</span>
                      )}
                    </div>
                  </TD>
                  <TD>{item.features.length}</TD>
                  <TD>
                    <Badge tone={item.isPublished ? "success" : "neutral"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      {isReordering ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveDraft(index, -1)}
                            disabled={index === 0 || isSavingOrder}
                            icon={<ArrowUp className="h-4 w-4" />}
                            iconPosition="left"
                          >
                            Up
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveDraft(index, 1)}
                            disabled={
                              index === rows.length - 1 || isSavingOrder
                            }
                            icon={<ArrowDown className="h-4 w-4" />}
                            iconPosition="left"
                          >
                            Down
                          </Button>
                        </>
                      ) : (
                        <>
                          <IconButton
                            icon={
                              item.isPublished ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )
                            }
                            label={
                              item.isPublished
                                ? `Unpublish “${item.name}”`
                                : `Publish “${item.name}”`
                            }
                            onClick={() => togglePublished(item)}
                            disabled={publishingId === item.id}
                          />
                          <IconButton
                            icon={<Pencil className="h-4 w-4" />}
                            label={`Edit “${item.name}”`}
                            onClick={() => openEdit(item)}
                          />
                          <IconButton
                            icon={<Trash2 className="h-4 w-4" />}
                            label={`Delete “${item.name}”`}
                            onClick={() => askDelete(item)}
                            tone="danger"
                          />
                        </>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </DataTableShell>
      </Card>

      {!isReordering && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Keyed so switching rows remounts the form with fresh defaults. */}
      {isFormOpen && (
        <ServiceFormModal
          key={editing?.id ?? "new"}
          service={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete service"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? Its features go with it, and the service disappears from the public services endpoints.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteServiceMutation.isPending}
      />
    </div>
  );
}
