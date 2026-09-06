import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, ArrowUpDown, Globe, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useDeleteService,
  useServices,
  useSetServicePublished,
} from "@/admin/hooks/useServices";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminService, Site } from "@/admin/types";
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
  PageHeader,
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

const SITE_OPTIONS = [
  { value: "", label: "Both sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

const PUBLISHED_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
] as const;

function toIsPublished(value: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [site, setSite] = useSearchParamState<Site | "">("site", "");
  const [published, setPublished] = useSearchParamState<string>(
    "published",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useServices({
    site: site || undefined,
    isPublished: toIsPublished(published),
    search,
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteServiceMutation = useDeleteService();
  const setPublishedMutation = useSetServicePublished();

  const error = queryError ? toErrorMessage(queryError) : null;

  function askDelete(target: AdminService) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteServiceMutation.mutateAsync(deleteTarget.id);
      toast.success("Service deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  async function togglePublished(target: AdminService) {
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

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = result?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Services"
        description={`${total} ${total === 1 ? "service" : "services"} — pricing plans hang off these.`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              href="/admin/services/order"
              icon={<ArrowUpDown className="h-4 w-4" />}
              iconPosition="left"
            >
              Reorder & Visibility
            </Button>
            <Button
              size="sm"
              href="/admin/services/new"
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
            >
              New service
            </Button>
          </div>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Service name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          fieldSize="sm"
          label="Site"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) => {
            setPage(1);
            setSite(event.target.value as Site | "");
          }}
          containerClassName="w-36"
        />

        <Select
          fieldSize="sm"
          label="Status"
          options={PUBLISHED_OPTIONS}
          value={published}
          onChange={(event) => {
            setPage(1);
            setPublished(event.target.value);
          }}
          containerClassName="w-36"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No services found"
          emptyDescription="No services match these filters."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Short description</TH>
              <TH>Sites</TH>
              <TH>Status</TH>
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
                      /{item.slug}
                    </span>
                  </TD>
                  <TD className="max-w-xs">
                    <span className="line-clamp-2">
                      {item.shortDescription}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.showOnAgency && (
                        <Badge
                          tone={item.featuredOnAgency ? "brand" : "neutral"}
                        >
                          {item.featuredOnAgency ? "Agency ★" : "Agency"}
                        </Badge>
                      )}
                      {item.showOnPersonal && (
                        <Badge
                          tone={item.featuredOnPersonal ? "brand" : "neutral"}
                        >
                          {item.featuredOnPersonal ? "Personal ★" : "Personal"}
                        </Badge>
                      )}
                      {!item.showOnAgency && !item.showOnPersonal && (
                        <span className="text-text-muted text-xs">Hidden</span>
                      )}
                    </div>
                  </TD>
                  <TD>
                    <Badge tone={item.isPublished ? "success" : "neutral"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={
                          item.isPublished ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )
                        }
                        className={item.isPublished ? "text-primary-500 hover:text-primary-400" : ""}
                        label={
                          item.isPublished
                            ? `Unpublish “${item.name}”`
                            : `Publish “${item.name}”`
                        }
                        onClick={() => togglePublished(item)}
                        disabled={publishingId === item.id}
                      />
                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.name}”`}
                        onClick={() => navigate(`/admin/services/${item.id}`)}
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
        title="Delete service"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? It disappears from the public services endpoints.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteServiceMutation.isPending}
      />
    </div>
  );
}
