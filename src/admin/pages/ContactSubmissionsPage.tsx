import { useState } from "react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import ContactSubmissionDetailModal from "@/admin/components/contact/ContactSubmissionDetailModal";
import {
  useContactSubmissions,
  useDeleteContactSubmission,
} from "@/admin/hooks/useContactSubmissions";
import { useServices } from "@/admin/hooks/useServices";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type {
  AdminContactSubmission,
  ContactSubmissionStatus,
  Site,
} from "@/admin/types";
import { contactStatusLabel, formatDate } from "@/admin/utils/format";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
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
/** Well above any realistic service count — this filter isn't paged. */
const SERVICE_PAGE_SIZE = 100;

const STATUS_OPTIONS: readonly { value: ContactSubmissionStatus; label: string }[] =
  ["new", "read", "replied", "archived", "spam"].map((value) => ({
    value: value as ContactSubmissionStatus,
    label: contactStatusLabel(value as ContactSubmissionStatus),
  }));

const SITE_OPTIONS: readonly { value: Site; label: string }[] = [
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
];

const STATUS_TONE: Record<
  ContactSubmissionStatus,
  "neutral" | "brand" | "success" | "warning" | "danger" | "info"
> = {
  new: "brand",
  read: "neutral",
  replied: "success",
  archived: "neutral",
  spam: "danger",
};

export default function ContactSubmissionsPage() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [status, setStatus] = useSearchParamState<ContactSubmissionStatus | "">(
    "status",
    "",
  );
  const [site, setSite] = useSearchParamState<Site | "">("site", "");
  const [serviceIdParam, setServiceIdParam] = useSearchParamState<string>(
    "serviceId",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [selected, setSelected] = useState<AdminContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminContactSubmission | null>(
    null,
  );

  const { data: servicesResult } = useServices({ pageSize: SERVICE_PAGE_SIZE });
  const serviceOptions = [
    { value: "", label: "Every service" },
    ...(servicesResult?.items ?? []).map((service) => ({
      value: service.id,
      label: service.name,
    })),
  ];

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useContactSubmissions({
    search,
    status: status || undefined,
    site: site || undefined,
    serviceId: serviceIdParam || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteMutation = useDeleteContactSubmission();

  const error = queryError ? toErrorMessage(queryError) : null;

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Submission deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const rows = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Contact submissions"
        description={`${total} ${total === 1 ? "enquiry" : "enquiries"} from the contact form.`}
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Name, email or message"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />

        <Select
          fieldSize="sm"
          label="Status"
          placeholder="All statuses"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as ContactSubmissionStatus | "");
          }}
          containerClassName="w-44"
        />

        <Select
          fieldSize="sm"
          label="Site"
          placeholder="Both sites"
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
          label="Service"
          options={serviceOptions}
          value={serviceIdParam}
          onChange={(event) => {
            setPage(1);
            setServiceIdParam(event.target.value);
          }}
          containerClassName="w-52"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="No submissions found"
          emptyDescription="No contact form enquiries match this filter."
        >
          <Table>
            <THead>
              <TH>From</TH>
              <TH>Message</TH>
              <TH>Service</TH>
              <TH>Site</TH>
              <TH>Status</TH>
              <TH>Submitted</TH>
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
                      {item.email}
                    </span>
                  </TD>
                  <TD className="max-w-xs truncate">
                    {item.subject ?? item.message}
                  </TD>
                  <TD>{item.serviceName ?? "General"}</TD>
                  <TD className="capitalize">{item.site}</TD>
                  <TD>
                    <Badge tone={STATUS_TONE[item.status]}>
                      {contactStatusLabel(item.status)}
                    </Badge>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.createdAt)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(item)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Delete
                      </Button>
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

      <ContactSubmissionDetailModal
        submission={selected}
        onClose={() => setSelected(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete submission"
        message={
          deleteTarget
            ? `Delete the enquiry from ${deleteTarget.name} (${deleteTarget.email})?`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
