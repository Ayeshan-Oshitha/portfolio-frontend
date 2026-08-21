import { useCallback, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
import ArticleFormModal from "@/admin/components/articles/ArticleFormModal";
import { useArticles, useDeleteArticle } from "@/admin/hooks/useArticles";
import { toErrorMessage } from "@/admin/api/ApiError";
import type { AdminArticle, Site } from "@/admin/types";
import { formatDate, formatDateOnly } from "@/admin/utils/format";

const PAGE_SIZE = 20;

/** `""` means "either site" — the API omits the filter entirely then. */
type SiteFilter = "" | Site;

/** `""` means "drafts and published"; the API takes a bool or nothing. */
type StatusFilter = "" | "published" | "draft";

const SITE_OPTIONS = [
  { value: "", label: "All sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

const STATUS_OPTIONS = [
  { value: "", label: "All articles" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

function toIsPublished(status: StatusFilter): boolean | undefined {
  if (status === "published") return true;
  if (status === "draft") return false;
  return undefined;
}

/**
 * Visibility is a pair of flags per site rather than a status enum, so each
 * site earns a chip only when shown, upgraded when it is also featured.
 */
function visibilityBadges(article: AdminArticle) {
  const badges: { key: string; label: string; featured: boolean }[] = [];

  if (article.showOnAgency) {
    badges.push({
      key: "agency",
      label: article.featuredOnAgency ? "Agency ★" : "Agency",
      featured: article.featuredOnAgency,
    });
  }

  if (article.showOnPersonal) {
    badges.push({
      key: "personal",
      label: article.featuredOnPersonal ? "Personal ★" : "Personal",
      featured: article.featuredOnPersonal,
    });
  }

  return badges;
}

export default function ArticlesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [site, setSite] = useState<SiteFilter>("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminArticle | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useArticles({
    search,
    site: site || undefined,
    isPublished: toIsPublished(status),
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteArticleMutation = useDeleteArticle();

  const error = queryError ? toErrorMessage(queryError) : null;

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setPage(1);
      setSearch(searchInput.trim());
    },
    [searchInput],
  );

  function handleSaved() {
    // Query invalidation on the mutation already refreshes the list.
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminArticle) {
    setEditing(target);
    setIsFormOpen(true);
  }

  function askDelete(target: AdminArticle) {
    setDeleteTarget(target);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteError(null);
    try {
      await deleteArticleMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (cause) {
      setDeleteError(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Articles</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "article" : "articles"} linking out to Medium.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openCreate}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New article
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex items-end gap-3 mb-6">
        <Input
          label="Search"
          placeholder="Article title"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          label="Site"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) => {
            setPage(1);
            setSite(event.target.value as SiteFilter);
          }}
          containerClassName="w-40"
        />

        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as StatusFilter);
          }}
          containerClassName="w-44"
        />

        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading articles" />
          </div>
        ) : !result || result.items.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No articles match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Published</th>
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
                    <td className="px-6 py-4 max-w-xs">
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <span className="truncate">{item.title}</span>
                        <a
                          href={item.mediumUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Open “${item.title}” on Medium`}
                          className="shrink-0 text-text-muted hover:text-primary-400 transition-colors"
                        >
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </span>
                      {item.slug && (
                        <span className="block text-text-muted text-xs truncate">
                          {item.slug}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.isPublished ? "subtle" : "outline"}>
                        {item.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const badges = visibilityBadges(item);
                        if (badges.length === 0) {
                          return <span className="text-text-muted">—</span>;
                        }
                        return (
                          <div className="flex flex-wrap items-center gap-2">
                            {badges.map(({ key, label, featured }) => (
                              <Badge
                                key={key}
                                variant={featured ? "subtle" : "outline"}
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.tags.length === 0 ? (
                        <span className="text-text-muted">—</span>
                      ) : (
                        item.tags.map((tag) => tag.name).join(", ")
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                      {formatDateOnly(item.publishedDate)}
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
        <ArticleFormModal
          key={editing?.id ?? "new"}
          article={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete article"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.title}”? It disappears from both public sites straight away.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteArticleMutation.isPending}
        error={deleteError}
      />
    </div>
  );
}
