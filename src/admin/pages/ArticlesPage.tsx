import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import {
  useArticles,
  useDeleteArticle,
  useReorderArticles,
} from "@/admin/hooks/useArticles";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminArticle, Site } from "@/admin/types";
import { formatDate, formatDateOnly } from "@/admin/utils/format";
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

/** Sort order is kept per site, so which column applies depends on the filter. */
function sortOrderFor(article: AdminArticle, site: Site): number {
  return site === "agency"
    ? article.agencySortOrder
    : article.personalSortOrder;
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
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [site, setSite] = useSearchParamState<SiteFilter>("site", "");
  const [status, setStatus] = useSearchParamState<StatusFilter>("status", "");
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const toast = useToast();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<AdminArticle | null>(null);

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
  const reorderArticlesMutation = useReorderArticles();

  const error = queryError ? toErrorMessage(queryError) : null;

  /**
   * Reordering renumbers the whole visible page, so the rows have to be in the
   * same order the arrows imply. The API already orders by the requested
   * site's column, but sorting here keeps the two in step after a local swap.
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
      await reorderArticlesMutation.mutateAsync({
        site,
        items: next.map((article, at) => ({
          id: article.id,
          // Page 2 continues where page 1 left off, so the offset matters.
          sortOrder: (page - 1) * PAGE_SIZE + at,
        })),
      });
      toast.success("Order updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  function askDelete(target: AdminArticle) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteArticleMutation.mutateAsync(deleteTarget.id);
      toast.success("Article deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isReordering = reorderArticlesMutation.isPending;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Articles"
        description={`${total} ${total === 1 ? "article" : "articles"} linking out to Medium.`}
        actions={
          <Button
            size="sm"
            href="/admin/articles/new"
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New article
          </Button>
        }
      />

      <Toolbar>
        <Input
          label="Search"
          fieldSize="sm"
          placeholder="Article title"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          label="Site"
          fieldSize="sm"
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
          fieldSize="sm"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as StatusFilter);
          }}
          containerClassName="w-44"
        />
      </Toolbar>

      {/* Reordering is only meaningful within one site, so the hint is only
          worth showing while no single site is selected. */}
      {!site && (
        <Alert variant="info" className="mb-6">
          Sort order is kept per site — pick a single site to reorder articles.
        </Alert>
      )}

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyIcon={Newspaper}
          emptyTitle="No articles found"
          emptyDescription="No articles match these filters. Try clearing the search or switching site."
        >
          <Table>
            <THead>
              <TH>Title</TH>
              <TH>Status</TH>
              <TH>Visibility</TH>
              <TH>Tags</TH>
              <TH>Published</TH>
              <TH>Updated</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item, index) => (
                <TR key={item.id}>
                  <TD variant="primary" className="max-w-xs">
                    <span className="flex items-center gap-2">
                      <span className="truncate">{item.title}</span>
                      <a
                        href={item.mediumUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open “${item.title}” on Medium`}
                        className="shrink-0 text-text-muted hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </span>
                    {item.slug && (
                      <span className="block text-text-muted text-xs font-normal truncate">
                        {item.slug}
                      </span>
                    )}
                  </TD>
                  <TD>
                    <Badge tone={item.isPublished ? "success" : "neutral"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TD>
                  <TD>
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
                              tone={featured ? "brand" : "neutral"}
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                  </TD>
                  <TD>
                    {item.tags.length === 0 ? (
                      <span className="text-text-muted">—</span>
                    ) : (
                      item.tags.map((tag) => tag.name).join(", ")
                    )}
                  </TD>
                  <TD variant="nowrap">{formatDateOnly(item.publishedDate)}</TD>
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<ArrowUp className="h-4 w-4" />}
                        label={
                          site
                            ? `Move “${item.title}” up`
                            : "Pick a single site to reorder articles"
                        }
                        onClick={() => move(index, -1)}
                        disabled={!site || isReordering || index === 0}
                      />
                      <IconButton
                        icon={<ArrowDown className="h-4 w-4" />}
                        label={
                          site
                            ? `Move “${item.title}” down`
                            : "Pick a single site to reorder articles"
                        }
                        onClick={() => move(index, 1)}
                        disabled={
                          !site || isReordering || index === rows.length - 1
                        }
                      />
                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.title}”`}
                        onClick={() => navigate(`/admin/articles/${item.id}`)}
                      />
                      <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        label={`Delete “${item.title}”`}
                        tone="danger"
                        onClick={() => askDelete(item)}
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
      />
    </div>
  );
}
