import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import PricingFormModal from "@/admin/components/pricing/PricingFormModal";
import SortablePricingPlanRow from "@/admin/components/pricing/SortablePricingPlanRow";
import {
  useDeletePricingPlan,
  usePricingPlans,
  useReorderPricingPlans,
  useSetPricingPlanPublished,
} from "@/admin/hooks/usePricing";
import { useServices } from "@/admin/hooks/useServices";
import { pricingKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import type { AdminPricingPlan, PagedResult } from "@/admin/types";
import {
  Card,
  ConfirmDialog,
  DataTableShell,
  Button,
  Input,
  PageHeader,
  Pagination,
  Select,
  Toolbar,
  Table,
  THead,
  TH,
  TBody,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

/** `""` means "both kinds" — the API omits the filter entirely then. */
type KindFilter = "" | "combo" | "service";

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

export default function PricingPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [kind, setKind] = useSearchParamState<KindFilter>("kind", "");
  const [serviceId, setServiceId] = useSearchParamState<string>("serviceId", "");
  const [published, setPublished] = useSearchParamState<string>("published", "");
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPricingPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPricingPlan | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const listParams = {
    // comboOnly/serviceId/tiersOnly are mutually exclusive — comboOnly wins over the other two,
    // and a specific serviceId wins over the "any service's tiers" tiersOnly filter.
    comboOnly: kind === "combo" ? true : undefined,
    serviceId: kind === "service" ? serviceId || undefined : undefined,
    tiersOnly: kind === "service" && !serviceId ? true : undefined,
    isPublished: toIsPublished(published),
    search,
    page,
    pageSize: PAGE_SIZE,
  };

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = usePricingPlans(listParams);
  // Loaded once: both the table and the form need to resolve a plan's serviceId to a name.
  const { data: servicesResult } = useServices({ pageSize: 100 });
  const services = servicesResult?.items ?? [];

  const deletePricingPlanMutation = useDeletePricingPlan();
  const setPublishedMutation = useSetPricingPlanPublished();
  const reorderPlansMutation = useReorderPricingPlans();

  const error = queryError ? toErrorMessage(queryError) : null;

  // Already ordered by sortOrder server-side.
  const rows = result?.items ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleKindChange(next: KindFilter) {
    setPage(1);
    setKind(next);
    // A service only narrows service tiers, so it cannot outlive the filter.
    if (next !== "service") setServiceId("");
  }

  function serviceName(id?: string): string {
    if (!id) return "Combo pack";
    return services.find((service) => service.id === id)?.name ?? "Service tier";
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
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deletePricingPlanMutation.mutateAsync(deleteTarget.id);
      toast.success("Pricing plan deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  async function togglePublished(target: AdminPricingPlan) {
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

  /**
   * Sends the whole page renumbered densely from the dropped order rather
   * than just the two swapped rows, so the numbering stays contiguous
   * however it started. Writes the reordered rows into the query cache
   * immediately (before the request resolves) so dnd-kit's already-reordered
   * drop position sticks instead of snapping back while the request is in
   * flight, and rolls back to the pre-drag snapshot on failure.
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((plan) => plan.id === active.id);
    const toIndex = rows.findIndex((plan) => plan.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((plan, at) => ({
      id: plan.id,
      // Page 2 continues where page 1 left off, so the offset matters.
      sortOrder: (page - 1) * PAGE_SIZE + at,
    }));

    const queryKey = pricingKeys.list(listParams);
    const previous = queryClient.getQueryData<PagedResult<AdminPricingPlan>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminPricingPlan> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((plan, at) => ({ ...plan, sortOrder: items[at].sortOrder })),
        },
    );

    try {
      await reorderPlansMutation.mutateAsync({ items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Pricing"
        description={`${total} ${total === 1 ? "plan" : "plans"} — agency site only.`}
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New plan
          </Button>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
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
          fieldSize="sm"
          label="Kind"
          options={KIND_OPTIONS}
          value={kind}
          onChange={(event) => handleKindChange(event.target.value as KindFilter)}
          containerClassName="w-40"
        />

        <Select
          fieldSize="sm"
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

      <p className="text-xs text-text-muted mb-6">
        Drag by the handle to set the order plans appear in.
      </p>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No pricing plans found"
          emptyDescription="No pricing plans match these filters."
        >
          <Table>
            <THead>
              <TH className="w-10 sr-only">Reorder</TH>
              <TH>Name</TH>
              <TH>Kind</TH>
              <TH>Price</TH>
              <TH>Delivery</TH>
              <TH>Features</TH>
              <TH>Status</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rows.map((plan) => plan.id)}
                strategy={verticalListSortingStrategy}
              >
                <TBody>
                  {rows.map((item) => (
                    <SortablePricingPlanRow
                      key={item.id}
                      plan={item}
                      serviceName={serviceName}
                      isPublishing={publishingId === item.id}
                      onTogglePublished={togglePublished}
                      onEdit={openEdit}
                      onDelete={askDelete}
                    />
                  ))}
                </TBody>
              </SortableContext>
            </DndContext>
          </Table>
        </DataTableShell>
      </Card>

      <Pagination page={page} totalPages={totalPages} onChange={(next) => setPage(next)} />

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
      />
    </div>
  );
}
