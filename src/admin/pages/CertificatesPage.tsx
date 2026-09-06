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
import CertificateFormModal from "@/admin/components/certificates/CertificateFormModal";
import SortableCertificateRow from "@/admin/components/certificates/SortableCertificateRow";
import {
  useCertificates,
  useDeleteCertificate,
  useReorderCertificates,
} from "@/admin/hooks/useCertificates";
import { certificateKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminCertificate, PagedResult } from "@/admin/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  Input,
  PageHeader,
  Pagination,
  Toolbar,
  Table,
  THead,
  TH,
  TBody,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

export default function CertificatesPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);

  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCertificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCertificate | null>(null);

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useCertificates({ search, page, pageSize: PAGE_SIZE });
  const deleteCertificateMutation = useDeleteCertificate();
  const reorderCertificatesMutation = useReorderCertificates();

  const error = queryError ? toErrorMessage(queryError) : null;

  // Already ordered by sortOrder server-side.
  const rows = result?.items ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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

    const fromIndex = rows.findIndex((row) => row.id === active.id);
    const toIndex = rows.findIndex((row) => row.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((row, at) => ({
      id: row.id,
      // Page 2 continues where page 1 left off, so the offset matters.
      sortOrder: (page - 1) * PAGE_SIZE + at,
    }));

    const queryKey = certificateKeys.list({ search, page, pageSize: PAGE_SIZE });
    const previous =
      queryClient.getQueryData<PagedResult<AdminCertificate>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminCertificate> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((row, at) => ({ ...row, sortOrder: items[at].sortOrder })),
        },
    );

    try {
      await reorderCertificatesMutation.mutateAsync({ items });
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

  function openEdit(target: AdminCertificate) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminCertificate) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteCertificateMutation.mutateAsync(deleteTarget.id);
      toast.success("Certificate deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const totalCount = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Certificates"
        description={`${totalCount} ${totalCount === 1 ? "certificate" : "certificates"} — personal site only.`}
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New certificate
          </Button>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Name or issuer"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />
      </Toolbar>

      <p className="text-xs text-text-muted mb-6">
        Drag by the handle to set the order certificates appear in.
      </p>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No certificates found"
          emptyDescription="No certificates match this search."
        >
          <Table>
            <THead>
              <TH className="w-10 sr-only">Reorder</TH>
              <TH>Name</TH>
              <TH>Issued by</TH>
              <TH>Date</TH>
              <TH>Featured</TH>
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
                items={rows.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                <TBody>
                  {rows.map((item) => (
                    <SortableCertificateRow
                      key={item.id}
                      certificate={item}
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
        <CertificateFormModal
          key={editing?.id ?? "new"}
          certificate={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete certificate"
        message={deleteTarget ? `Delete “${deleteTarget.name}”?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteCertificateMutation.isPending}
      />
    </div>
  );
}
