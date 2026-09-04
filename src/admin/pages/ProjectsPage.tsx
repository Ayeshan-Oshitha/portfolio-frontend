import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useDeleteProject,
  useProjects,
  useReorderProjects,
  useSetProjectPublished,
} from "@/admin/hooks/useProjects";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminProject, Site } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
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
  { value: "", label: "All projects" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

function toIsPublished(status: StatusFilter): boolean | undefined {
  if (status === "published") return true;
  if (status === "draft") return false;
  return undefined;
}

/** Sort order is kept per site, so which column applies depends on the filter. */
function sortOrderFor(project: AdminProject, site: Site): number {
  return site === "agency"
    ? project.agencySortOrder
    : project.personalSortOrder;
}

/**
 * Visibility is a pair of flags per site rather than a status enum, so each
 * site earns a chip only when shown, upgraded when it is also featured.
 */
function visibilityBadges(project: AdminProject) {
  const badges: { key: string; label: string; featured: boolean }[] = [];

  if (project.showOnAgency) {
    badges.push({
      key: "agency",
      label: project.featuredOnAgency ? "Agency ★" : "Agency",
      featured: project.featuredOnAgency,
    });
  }

  if (project.showOnPersonal) {
    badges.push({
      key: "personal",
      label: project.featuredOnPersonal ? "Personal ★" : "Personal",
      featured: project.featuredOnPersonal,
    });
  }

  return badges;
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const toast = useToast();

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

  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useProjects({
    search,
    site: site || undefined,
    isPublished: toIsPublished(status),
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteProjectMutation = useDeleteProject();
  const setPublishedMutation = useSetProjectPublished();
  const reorderProjectsMutation = useReorderProjects();

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

  async function togglePublished(target: AdminProject) {
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
      await reorderProjectsMutation.mutateAsync({
        site,
        items: next.map((project, at) => ({
          id: project.id,
          // Page 2 continues where page 1 left off, so the offset matters.
          sortOrder: (page - 1) * PAGE_SIZE + at,
        })),
      });
      toast.success("Order updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  function askDelete(target: AdminProject) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteProjectMutation.mutateAsync(deleteTarget.id);
      toast.success("Project deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isReordering = reorderProjectsMutation.isPending;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Projects"
        description={`${total} ${total === 1 ? "case study" : "case studies"} across both sites.`}
        actions={
          <Button
            size="sm"
            onClick={() => navigate("/admin/projects/new")}
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
          >
            New project
          </Button>
        }
      />

      <Toolbar>
        <Input
          label="Search"
          fieldSize="sm"
          placeholder="Project title"
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
          Sort order is kept per site — pick a single site to reorder projects.
        </Alert>
      )}

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isEmpty={rows.length === 0}
          emptyIcon={FolderKanban}
          emptyTitle="No projects found"
          emptyDescription="No projects match these filters. Try clearing the search or switching site."
        >
          <Table>
            <THead>
              <TH>Title</TH>
              <TH>Year</TH>
              <TH>Status</TH>
              <TH>Visibility</TH>
              <TH>Tags</TH>
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
                        href={`/work/${item.slug}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open “${item.title}” on the public site`}
                        className="shrink-0 text-text-muted hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </span>
                    <span className="block text-text-muted text-xs font-normal truncate">
                      {item.slug}
                    </span>
                  </TD>
                  <TD variant="nowrap">{item.year}</TD>
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
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<ArrowUp className="h-4 w-4" />}
                        label={
                          site
                            ? `Move “${item.title}” up`
                            : "Pick a single site to reorder projects"
                        }
                        onClick={() => move(index, -1)}
                        disabled={!site || isReordering || index === 0}
                      />
                      <IconButton
                        icon={<ArrowDown className="h-4 w-4" />}
                        label={
                          site
                            ? `Move “${item.title}” down`
                            : "Pick a single site to reorder projects"
                        }
                        onClick={() => move(index, 1)}
                        disabled={
                          !site || isReordering || index === rows.length - 1
                        }
                      />
                      <IconButton
                        icon={
                          item.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )
                        }
                        label={
                          item.isPublished
                            ? `Unpublish “${item.title}”`
                            : `Publish “${item.title}”`
                        }
                        onClick={() => togglePublished(item)}
                        disabled={publishingId === item.id}
                      />
                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.title}”`}
                        onClick={() => navigate(`/admin/projects/${item.id}`)}
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
        title="Delete project"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.title}”? It disappears from both public sites straight away.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteProjectMutation.isPending}
      />
    </div>
  );
}
