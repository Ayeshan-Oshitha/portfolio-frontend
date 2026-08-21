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
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
import PricingFormModal from "@/admin/components/pricing/PricingFormModal";
import {
  useDeletePricingPlan,
  usePricingPlans,
  useReorderPricingPlans,
  useSetPricingPlanPublished,
} from "@/admin/hooks/usePricing";
import { useServices } from "@/admin/hooks/useServices";
import { toErrorMessage } from "@/admin/api/ApiError";
import { formatDelivery, formatPrice } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { AdminPricingPlan, Site } from "@/admin/types";

const PAGE_SIZE = 20;

/**
 * Reordering renumbers a whole site at once, so it needs the plans on one
 * page. 100 is the API's own `pageSize` ceiling.
 */
const REORDER_PAGE_SIZE = 100;

/** `""` means "both kinds" — the API omits the filter entirely then. */
type KindFilter = "" | "combo" | "service";

const SITE_OPTIONS = [
  { value: "", label: "Both sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

const KIND_OPTIONS = [
  { value: "", label: "All plans" },
  { value: "combo", label: "Combo packs" },
  { value: "service", label: "Service tiers" },
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

/** The site whose order a plan carries — reordering is per site. */
function siteSortOrder(plan: AdminPricingPlan, site: Site): number {
  return site === "agency" ? plan.agencySortOrder : plan.personalSortOrder;
}

export default function PricingPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput);
  const [site, setSite] = useState<Site | "">("");
  const [kind, setKind] = useState<KindFilter>("");
  const [serviceId, setServiceId] = useState("");
  const [published, setPublished] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPricingPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPricingPlan | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [isReordering, setIsReordering] = useState(false);
  const [orderOverride, setOrderOverride] = useState<string[] | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = usePricingPlans({
    site: site || undefined,
    // `comboOnly` makes the API ignore `serviceId`, so the two filters are
    // never sent together.
    comboOnly: kind === "combo" ? true : undefined,
    serviceId: kind === "combo" ? undefined : serviceId || undefined,
    isPublished: toIsPublished(published),
    search,
    page: isReordering ? 1 : page,
    pageSize: isReordering ? REORDER_PAGE_SIZE : PAGE_SIZE,
  });
  // Loaded once: a plan points at a service by id and the table and the form
  // both need its name.
  const { data: servicesResult } = useServices({ pageSize: 100 });
  const services = servicesResult?.items ?? [];

  const deletePricingPlanMutation = useDeletePricingPlan();
  const setPublishedMutation = useSetPricingPlanPublished();
  const reorderPlansMutation = useReorderPricingPlans();

  const error =
    actionError ?? (queryError ? toErrorMessage(queryError) : null);

  /**
   * The API returns plans in name order, so the reorder list has to be sorted
   * by the site's own sort order first.
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
   * holding stale plans. An id list that no longer lines up with the data is
   * dropped, which is the same thing cancelling would do.
   */
  const orderedRows = useMemo(() => {
    if (!orderOverride) return sortedForSite;

    const byId = new Map(sortedForSite.map((plan) => [plan.id, plan]));
    const picked = orderOverride
      .map((id) => byId.get(id))
      .filter((plan): plan is AdminPricingPlan => plan !== undefined);

    return picked.length === sortedForSite.length ? picked : sortedForSite;
  }, [orderOverride, sortedForSite]);

  function handleSiteChange(next: Site | "") {
    setPage(1);
    setSite(next);
    // Sort order is per site, so a pending reorder cannot outlive the filter.
    setOrderOverride(null);
    if (!next) setIsReordering(false);
  }

  function handleKindChange(next: KindFilter) {
    setPage(1);
    setKind(next);
    // A service only narrows service tiers, so it cannot outlive the filter.
    if (next !== "service") setServiceId("");
  }

  function serviceName(id?: string): string {
    if (!id) return "Combo pack";
    return (
      services.find((service) => service.id === id)?.name ?? "Service tier"
    );
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminPricingPlan) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminPricingPlan) {
    setDeleteTarget(target);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteError(null);
    try {
      await deletePricingPlanMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (cause) {
      setDeleteError(toErrorMessage(cause));
    }
  }

  async function togglePublished(target: AdminPricingPlan) {
    setPublishingId(target.id);
    setActionError(null);
    try {
      await setPublishedMutation.mutateAsync({
        id: target.id,
        isPublished: !target.isPublished,
      });
    } catch (cause) {
      setActionError(toErrorMessage(cause));
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

    const next = orderedRows.map((plan) => plan.id);
    [next[index], next[target]] = [next[target], next[index]];
    setOrderOverride(next);
  }

  async function saveOrder() {
    if (!site) return;

    setActionError(null);
    try {
      await reorderPlansMutation.mutateAsync({
        site,
        items: orderedRows.map((plan, index) => ({
          id: plan.id,
          sortOrder: index,
        })),
      });
      setOrderOverride(null);
      setIsReordering(false);
    } catch (cause) {
      setActionError(toErrorMessage(cause));
    }
  }

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = isReordering ? orderedRows : (result?.items ?? []);
  const isSavingOrder = reorderPlansMutation.isPending;

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Pricing</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "plan" : "plans"} across combo packs and
            service tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isReordering ? (
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
                New plan
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <Input
          label="Search"
          placeholder="Plan name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          label="Site"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) =>
            handleSiteChange(event.target.value as Site | "")
          }
          containerClassName="w-36"
        />

        <Select
          label="Kind"
          options={KIND_OPTIONS}
          value={kind}
          onChange={(event) =>
            handleKindChange(event.target.value as KindFilter)
          }
          containerClassName="w-40"
        />

        <Select
          label="Service"
          placeholder="Any"
          options={serviceOptions}
          value={serviceId}
          disabled={kind !== "service"}
          onChange={(event) => {
            setPage(1);
            setServiceId(event.target.value);
          }}
          containerClassName="w-44"
        />

        <Select
          label="Status"
          options={PUBLISHED_OPTIONS}
          value={published}
          onChange={(event) => {
            setPage(1);
            setPublished(event.target.value);
          }}
          containerClassName="w-36"
        />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

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

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading pricing plans" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No pricing plans match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Kind</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Delivery</th>
                  <th className="px-6 py-4">Features</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <span className="block text-text-primary font-medium">
                        {item.name}
                      </span>
                      {item.tagline && (
                        <span className="block text-text-muted text-xs">
                          {item.tagline}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.serviceId ? (
                        <Badge variant="outline">
                          {serviceName(item.serviceId)}
                        </Badge>
                      ) : (
                        <Badge variant="subtle">Combo pack</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatPrice(item)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDelivery(item)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.features.length}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={item.isPublished ? "default" : "subtle"}
                        >
                          {item.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {item.isPopular && (
                          <Badge variant="outline">Popular</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublished(item)}
                              loading={publishingId === item.id}
                              icon={
                                item.isPublished ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )
                              }
                              iconPosition="left"
                            >
                              {item.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(item)}
                              icon={<Pencil className="h-4 w-4" />}
                              iconPosition="left"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => askDelete(item)}
                              icon={<Trash2 className="h-4 w-4" />}
                              iconPosition="left"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        <PricingFormModal
          key={editing?.id ?? "new"}
          plan={editing}
          services={services}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete pricing plan"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? Its features go with it, and the plan disappears from the public pricing endpoints.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deletePricingPlanMutation.isPending}
        error={deleteError}
      />
    </div>
  );
}
