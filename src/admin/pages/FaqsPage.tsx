import { useMemo, useState } from "react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import FaqFormModal from "@/admin/components/faqs/FaqFormModal";
import { useDeleteFaq, useFaqs, useReorderFaqs } from "@/admin/hooks/useFaqs";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminFaq, Site } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
  Input,
  PageHeader,
  Pagination,
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

/** `""` means "either site" — the API omits the filter entirely then. */
type SiteFilter = "" | Site;

const SITE_OPTIONS = [
  { value: "", label: "All sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

/** Sort order is kept per site, so which column applies depends on the filter. */
function sortOrderFor(faq: AdminFaq, site: Site): number {
  return site === "agency" ? faq.agencySortOrder : faq.personalSortOrder;
}

export default function FaqsPage() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [site, setSite] = useSearchParamState<SiteFilter>("site", "");
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useFaqs({ search, page, pageSize: PAGE_SIZE });
  const deleteFaqMutation = useDeleteFaq();
  const reorderFaqsMutation = useReorderFaqs();

  const error = queryError ? toErrorMessage(queryError) : null;

  /**
   * Reordering renumbers the whole visible page, so the rows have to be in the
   * same order the arrows imply.
   */
  const rows = useMemo(() => {
    const items = result?.items ?? [];
    if (!site) return items;
    return [...items].sort(
      (a, b) => sortOrderFor(a, site) - sortOrderFor(b, site),
    );
  }, [result, site]);

  /**
   * Sends the whole page renumbered densely from the index rather than just the
   * two swapped rows, so the numbering stays contiguous however it started.
   */
  async function move(index: number, delta: number) {
    if (!site) return;

    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await reorderFaqsMutation.mutateAsync({
        site,
        items: next.map((faq, at) => ({
          id: faq.id,
          // Page 2 continues where page 1 left off, so the offset matters.
          sortOrder: (page - 1) * PAGE_SIZE + at,
        })),
      });
      toast.success("Order updated.");
    } catch (cause) {
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

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isReordering = reorderFaqsMutation.isPending;

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="FAQs"
        description={`${total} ${total === 1 ? "question" : "questions"} shown across both sites.`}
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
          label="Site"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) => {
            setPage(1);
            setSite(event.target.value as SiteFilter);
          }}
          containerClassName="w-40"
        />
      </Toolbar>

      <p className="text-xs text-text-muted mb-6">
        {site
          ? "Use the arrows to set the order FAQs appear in on the selected site."
          : "Sort order is kept per site — pick a single site to reorder FAQs."}
      </p>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyTitle="No FAQs found"
          emptyDescription="No FAQs match this search."
        >
          <Table>
            <THead>
              <TH>Question</TH>
              <TH>Category</TH>
              <TH>Status</TH>
              <TH>Updated</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item, index) => (
                <TR key={item.id}>
                  <TD className="max-w-sm">
                    <span className="block text-text-primary font-medium truncate">
                      {item.question}
                    </span>
                  </TD>
                  <TD>{item.category ?? "—"}</TD>
                  <TD>
                    <Badge tone={item.isPublished ? "success" : "neutral"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<ArrowUp className="h-4 w-4" />}
                        label={`Move “${item.question}” up`}
                        onClick={() => move(index, -1)}
                        disabled={!site || isReordering || index === 0}
                      />
                      <IconButton
                        icon={<ArrowDown className="h-4 w-4" />}
                        label={`Move “${item.question}” down`}
                        onClick={() => move(index, 1)}
                        disabled={
                          !site || isReordering || index === rows.length - 1
                        }
                      />

                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.question}”`}
                        onClick={() => openEdit(item)}
                      />
                      <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        label={`Delete “${item.question}”`}
                        onClick={() => askDelete(item)}
                        tone="danger"
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
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
