import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
import TagFormModal from "@/admin/components/tags/TagFormModal";
import { useDeleteTag, useTags } from "@/admin/hooks/useTags";
import { toErrorMessage } from "@/admin/api/ApiError";
import type { AdminTag, TechCategory } from "@/admin/types";
import {
  TECH_CATEGORIES,
  formatDate,
  techCategoryLabel,
} from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";

const PAGE_SIZE = 20;

/** `""` means "both kinds" — the API omits the filter entirely then. */
type KindFilter = "" | "technology" | "category";

const KIND_OPTIONS = [
  { value: "", label: "All tags" },
  { value: "technology", label: "Technologies" },
  { value: "category", label: "Categories" },
] as const;

const CATEGORY_OPTIONS = TECH_CATEGORIES.map((category) => ({
  value: category,
  label: techCategoryLabel(category),
}));

function toIsTechnology(kind: KindFilter): boolean | undefined {
  if (kind === "technology") return true;
  if (kind === "category") return false;
  return undefined;
}

export default function TagsPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput);
  const [kind, setKind] = useState<KindFilter>("");
  const [category, setCategory] = useState<TechCategory | "">("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTag | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
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
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteError(null);
    try {
      await deleteTagMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (cause) {
      // Surfaces the API's `tag_in_use` message, which names the content still holding the tag.
      setDeleteError(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Tags</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "tag" : "tags"} shared by projects and
            articles.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New tag
        </Button>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <Input
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
          label="Kind"
          options={KIND_OPTIONS}
          value={kind}
          onChange={(event) =>
            handleKindChange(event.target.value as KindFilter)
          }
          containerClassName="w-40"
        />

        <Select
          label="Category"
          placeholder="Any"
          options={CATEGORY_OPTIONS}
          value={category}
          disabled={kind !== "technology"}
          onChange={(event) => {
            setPage(1);
            setCategory(event.target.value as TechCategory | "");
          }}
          containerClassName="w-44"
        />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading tags" />
          </div>
        ) : !result || result.items.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No tags match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Kind</th>
                  <th className="px-6 py-4">Colour</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <span className="block text-text-primary font-medium">
                        {item.name}
                      </span>
                      <span className="block text-text-muted text-xs">
                        {item.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="subtle">
                          {item.isTechnology ? "Technology" : "Category"}
                        </Badge>
                        {item.technologyCategory && (
                          <Badge variant="outline">
                            {techCategoryLabel(item.technologyCategory)}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.colorHex ? (
                        <span className="inline-flex items-center gap-2 text-text-secondary">
                          <span
                            className="h-4 w-4 rounded border border-border-subtle"
                            style={{ backgroundColor: item.colorHex }}
                            aria-hidden="true"
                          />
                          {item.colorHex}
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
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
        error={deleteError}
      />
    </div>
  );
}
