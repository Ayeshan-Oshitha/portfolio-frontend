import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import TagFormModal from "@/admin/components/tags/TagFormModal";
import {
  useDeleteTag,
  useTags,
  useTechCategories,
} from "@/admin/hooks/useTags";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminTag, TechCategory } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import {
  FIELD_BASE,
  FIELD_LABEL,
  FIELD_SIZE,
} from "@/admin/components/ui/fieldClasses";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
  Input,
  LoadingDots,
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

/** `""` means "both kinds" — the API omits the filter entirely then. */
type KindFilter = "" | "technology" | "category";

const KIND_OPTIONS = [
  { value: "", label: "All tags" },
  { value: "technology", label: "Technologies" },
  { value: "category", label: "Categories" },
] as const;

function toIsTechnology(kind: KindFilter): boolean | undefined {
  if (kind === "technology") return true;
  if (kind === "category") return false;
  return undefined;
}

export default function TagsPage() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [kind, setKind] = useSearchParamState<KindFilter>("kind", "");
  const [category, setCategory] = useSearchParamState<TechCategory | "">(
    "category",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTag | null>(null);

  const { data: techCategories, isPending: isLoadingCategories } =
    useTechCategories();
  const categoryOptions = (techCategories ?? []).map((option) => ({
    value: option.value,
    label: option.label,
  }));
  const categoryLabel = (value: TechCategory) =>
    techCategories?.find((option) => option.value === value)?.label ?? value;

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useTags({
    search,
    isTechnology: toIsTechnology(kind),
    category: category || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteTagMutation = useDeleteTag();

  const error = queryError ? toErrorMessage(queryError) : null;

  function handleKindChange(next: KindFilter) {
    setPage(1);
    setKind(next);
    // A category only narrows technologies, so it cannot outlive the filter.
    if (next !== "technology") setCategory("");
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminTag) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminTag) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteTagMutation.mutateAsync(deleteTarget.id);
      toast.success("Tag deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      // Surfaces the API's `tag_in_use` message, which names the content still holding the tag.
      toast.error(toErrorMessage(cause));
    }
  }

  const rows = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Tags"
        description={`${total} ${total === 1 ? "tag" : "tags"} shared by projects and articles.`}
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New tag
          </Button>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Tag name"
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
          onChange={(event) =>
            handleKindChange(event.target.value as KindFilter)
          }
          containerClassName="w-40"
        />

        {isLoadingCategories ? (
          <div className="w-44">
            <span className={FIELD_LABEL}>Tech Category</span>
            <div
              className={`${FIELD_BASE} ${FIELD_SIZE.sm} flex items-center border-border-default text-text-muted`}
            >
              <LoadingDots label="Loading categories" />
            </div>
          </div>
        ) : (
          <Select
            fieldSize="sm"
            label="Tech Category"
            placeholder="Any"
            options={categoryOptions}
            value={category}
            disabled={kind !== "technology"}
            onChange={(event) => {
              setPage(1);
              setCategory(event.target.value as TechCategory | "");
            }}
            containerClassName="w-44"
          />
        )}
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No tags found"
          emptyDescription="No tags match these filters."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Kind</TH>
              <TH>Updated</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item) => (
                <TR key={item.id}>
                  <TD>
                    <span className="block text-text-primary font-medium">
                      {item.name}
                    </span>
                    <span className="block text-text-muted text-xs">
                      {item.slug}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">
                        {item.isTechnology ? "Technology" : "Category"}
                      </Badge>
                      {item.technologyCategory && (
                        <Badge variant="outline">
                          {categoryLabel(item.technologyCategory)}
                        </Badge>
                      )}
                    </div>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
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
        <TagFormModal
          key={editing?.id ?? "new"}
          tag={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete tag"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? Projects and articles still using it must drop it first.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteTagMutation.isPending}
      />
    </div>
  );
}
