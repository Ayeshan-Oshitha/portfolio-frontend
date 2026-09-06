import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import { useArticles, useDeleteArticle } from "@/admin/hooks/useArticles";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminArticle, Site } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
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
    isFetching,
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
  const rows = result?.items ?? [];

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

  return (
    <div>
      <PageHeader
        title="Articles"
        description={`${total} ${total === 1 ? "article" : "articles"}.`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              href="/admin/articles/order"
              icon={<ArrowUpDown className="h-4 w-4" />}
              iconPosition="left"
            >
              Reorder & Visibility
            </Button>
            <Button
              size="sm"
              href="/admin/articles/new"
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
            >
              New article
            </Button>
          </div>
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

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
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
              {rows.map((item) => (
                <TR key={item.id}>
                  <TD variant="primary" className="max-w-xs">
                    <span className="truncate">{item.title}</span>
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
                  <TD variant="nowrap">{formatDate(item.publishedAt)}</TD>
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
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
