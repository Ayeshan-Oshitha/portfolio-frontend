import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Badge from "@/portfolio/components/ui/Badge";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import ConfirmDialog from "@/admin/components/ui/ConfirmDialog";
import Input from "@/admin/components/ui/Input";
import Select from "@/admin/components/ui/Select";
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
  return site === "agency" ? project.agencySortOrder : project.personalSortOrder;
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

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput);
  const [site, setSite] = useState<SiteFilter>("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);

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
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Projects</h1>
          <p className="text-sm text-text-muted">
            {total} {total === 1 ? "case study" : "case studies"} across both
            sites.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/admin/projects/new")}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          New project
        </Button>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <Input
          label="Search"
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
      </div>

      <p className="text-xs text-text-muted mb-6">
        {site
          ? "Use the arrows to set the order projects appear in on the selected site."
          : "Sort order is kept per site — pick a single site to reorder projects."}
      </p>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-primary-400">
            <Spinner className="h-6 w-6" label="Loading projects" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            No projects match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-semibold tracking-widest uppercase text-text-muted">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-border-subtle/60 last:border-0"
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <span className="flex items-center gap-2 text-text-primary font-medium">
                        <span className="truncate">{item.title}</span>
                        <a
                          href={`/work/${item.slug}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`Open “${item.title}” on the public site`}
                          className="shrink-0 text-text-muted hover:text-primary-400 transition-colors"
                        >
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </span>
                      <span className="block text-text-muted text-xs truncate">
                        {item.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {item.year}
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
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={!site || isReordering || index === 0}
                          aria-label={`Move “${item.title}” up`}
                          title={
                            site
                              ? "Move up"
                              : "Pick a single site to reorder projects"
                          }
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={
                            !site || isReordering || index === rows.length - 1
                          }
                          aria-label={`Move “${item.title}” down`}
                          title={
                            site
                              ? "Move down"
                              : "Pick a single site to reorder projects"
                          }
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(item)}
                          loading={publishingId === item.id}
                        >
                          {item.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/projects/${item.id}`)}
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
