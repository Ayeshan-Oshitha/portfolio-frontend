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
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import { Plus } from "lucide-react";
import FaqFormModal from "@/admin/components/faqs/FaqFormModal";
import SortableFaqRow from "@/admin/components/faqs/SortableFaqRow";
import { useDeleteFaq, useFaqs, useReorderFaqs } from "@/admin/hooks/useFaqs";
import { useServices } from "@/admin/hooks/useServices";
import { faqKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminFaq, PagedResult, Site } from "@/admin/types";
import {
  FIELD_BASE,
  FIELD_LABEL,
  FIELD_STATE,
} from "@/admin/components/ui/fieldClasses";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  DataTableShell,
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
/** Well above any realistic service count — this filter isn't paged. */
const SERVICE_PAGE_SIZE = 100;
/** Sentinel `<select>` values — actual service ids never collide with these. */
const SCOPE_ALL = "";
const SCOPE_GLOBAL = "__global__";

export default function FaqsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);

  // Encoded as "1"/"0" strings so the default (agency only) leaves the URL
  // clean — `useSearchParamState` omits a param once it matches its default.
  const [agencyParam, setAgencyParam] = useSearchParamState<string>(
    "agency",
    "1",
  );
  const [personalParam, setPersonalParam] = useSearchParamState<string>(
    "personal",
    "0",
  );
  const agencyChecked = agencyParam === "1";
  const personalChecked = personalParam === "1";
  const bothChecked = agencyChecked && personalChecked;
  const noneChecked = !agencyChecked && !personalChecked;
  const activeSite: Site | null =
    agencyChecked !== personalChecked
      ? agencyChecked
        ? "agency"
        : "personal"
      : null;
  // Both and neither both mean "don't filter by site" to the API — the
  // "match nothing" case is handled by not querying at all, below.
  const querySite = activeSite ?? undefined;

  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);

  // "" = every scope (today's behaviour), a magic string = global only,
  // anything else = that service's own FAQs.
  const [scopeParam, setScopeParam] = useSearchParamState<string>(
    "scope",
    SCOPE_ALL,
  );
  const { data: servicesResult } = useServices({ pageSize: SERVICE_PAGE_SIZE });
  const scopeOptions = [
    { value: SCOPE_ALL, label: "Every scope" },
    { value: SCOPE_GLOBAL, label: "Global only" },
    ...(servicesResult?.items ?? []).map((service) => ({
      value: service.id,
      label: service.name,
    })),
  ];
  const serviceId =
    scopeParam !== SCOPE_ALL && scopeParam !== SCOPE_GLOBAL
      ? scopeParam
      : undefined;
  const globalOnly = scopeParam === SCOPE_GLOBAL;

  const {
    data: result,
    isPending: isLoadingQuery,
    isFetching: isFetchingQuery,
    error: queryError,
  } = useFaqs(
    { search, site: querySite, serviceId, globalOnly, page, pageSize: PAGE_SIZE },
    !noneChecked,
  );
  const deleteFaqMutation = useDeleteFaq();
  const reorderFaqsMutation = useReorderFaqs();

  // With no site selected there is nothing to fetch — the query above stays
  // disabled, so `isLoadingQuery`/`isFetchingQuery` never resolve on their own.
  const isLoading = !noneChecked && isLoadingQuery;
  const isFetching = !noneChecked && isFetchingQuery;
  const error = queryError ? toErrorMessage(queryError) : null;

  // Already ordered by sortOrder server-side — FAQs share one order across
  // both sites, so there's no per-site re-sort to do here.
  const rows = noneChecked ? [] : (result?.items ?? []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

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

    const fromIndex = rows.findIndex((faq) => faq.id === active.id);
    const toIndex = rows.findIndex((faq) => faq.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((faq, at) => ({
      id: faq.id,
      // Page 2 continues where page 1 left off, so the offset matters.
      sortOrder: (page - 1) * PAGE_SIZE + at,
    }));

    const queryKey = faqKeys.list({
      search,
      site: querySite,
      serviceId,
      globalOnly,
      page,
      pageSize: PAGE_SIZE,
    });
    const previous =
      queryClient.getQueryData<PagedResult<AdminFaq>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminFaq> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((faq, at) => ({ ...faq, sortOrder: items[at].sortOrder })),
        },
    );

    try {
      await reorderFaqsMutation.mutateAsync({ items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminFaq) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminFaq) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteFaqMutation.mutateAsync(deleteTarget.id);
      toast.success("FAQ deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const totalCount = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const description = noneChecked
    ? "Select at least one site to see its FAQs."
    : bothChecked
      ? `${totalCount} ${totalCount === 1 ? "question" : "questions"} shown across both sites.`
      : `${totalCount} ${totalCount === 1 ? "question" : "questions"} shown for ${activeSite === "agency" ? "Agency" : "Personal"}.`;

  const hint = noneChecked
    ? "Check Agency and/or Personal to see FAQs."
    : "Drag by the handle to set the order FAQs appear in — the order is shared by both sites.";

  return (
    <div>
      <PageHeader
        title="FAQs"
        description={description}
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New FAQ
          </Button>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Question"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />

        <Select
          fieldSize="sm"
          label="Scope"
          options={scopeOptions}
          value={scopeParam}
          onChange={(event) => {
            setPage(1);
            setScopeParam(event.target.value);
          }}
          containerClassName="w-48"
        />

        <div className="ml-3">
          <span className={FIELD_LABEL}>Site</span>
          <div
            className={`${FIELD_BASE} ${FIELD_STATE.default} flex h-9 items-center gap-4 px-3`}
          >
            <Checkbox
              label="Agency"
              checked={agencyChecked}
              onChange={(event) => {
                setPage(1);
                setAgencyParam(event.target.checked ? "1" : "0");
              }}
            />
            <Checkbox
              label="Personal"
              checked={personalChecked}
              onChange={(event) => {
                setPage(1);
                setPersonalParam(event.target.checked ? "1" : "0");
              }}
            />
          </div>
        </div>
      </Toolbar>

      <p className="text-xs text-text-muted mb-6">{hint}</p>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No FAQs found"
          emptyDescription={
            noneChecked
              ? "Check Agency and/or Personal above to see FAQs."
              : "No FAQs match this search."
          }
        >
          <Table>
            <THead>
              <TH className="w-10 sr-only">Reorder</TH>
              <TH>Question</TH>
              <TH>Scope</TH>
              <TH>Status</TH>
              <TH>Updated</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rows.map((faq) => faq.id)}
                strategy={verticalListSortingStrategy}
              >
                <TBody>
                  {rows.map((item) => (
                    <SortableFaqRow
                      key={item.id}
                      faq={item}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(next) => setPage(next)}
      />

      {/* Keyed so switching rows remounts the form with fresh defaults. */}
      {isFormOpen && (
        <FaqFormModal
          key={editing?.id ?? "new"}
          faq={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete FAQ"
        message={deleteTarget ? `Delete “${deleteTarget.question}”?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteFaqMutation.isPending}
      />
    </div>
  );
}
