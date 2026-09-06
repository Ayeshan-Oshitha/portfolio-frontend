import { useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import CurrencyFormModal from "@/admin/components/currencies/CurrencyFormModal";
import {
  useCurrencies,
  useDeleteCurrency,
  useRefreshCurrencyRates,
} from "@/admin/hooks/useCurrencies";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminCurrency } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { BASE_CURRENCY_CODE } from "@/admin/validation/currencySchemas";
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

/** `""` means "both" — the API omits the filter entirely then. */
type ActiveFilter = "" | "active" | "inactive";

const ACTIVE_OPTIONS = [
  { value: "", label: "All currencies" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

function toIsActive(filter: ActiveFilter): boolean | undefined {
  if (filter === "active") return true;
  if (filter === "inactive") return false;
  return undefined;
}

export default function CurrenciesPage() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [activeFilter, setActiveFilter] = useSearchParamState<ActiveFilter>(
    "active",
    "",
  );
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCurrency | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCurrency | null>(null);

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useCurrencies({
    search,
    isActive: toIsActive(activeFilter),
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteCurrencyMutation = useDeleteCurrency();
  const refreshRatesMutation = useRefreshCurrencyRates();

  const error = queryError ? toErrorMessage(queryError) : null;

  async function handleRefreshRates() {
    try {
      const result = await refreshRatesMutation.mutateAsync();
      toast.success(
        `Updated ${result.updatedCount} ${result.updatedCount === 1 ? "currency" : "currencies"}.`,
      );
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(target: AdminCurrency) {
    setEditing(target);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteCurrencyMutation.mutateAsync(deleteTarget.id);
      toast.success("Currency deleted.");
      setDeleteTarget(null);
    } catch (cause) {
      // Surfaces the API's `currency_in_use` message, which names how many plans still price in it.
      toast.error(toErrorMessage(cause));
    }
  }

  const rows = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Currencies"
        description="Set a price yourself, or leave it to the actual price from the last refresh."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshRates}
              loading={refreshRatesMutation.isPending}
              icon={<RefreshCw className="h-4 w-4" />}
              iconPosition="left"
            >
              Refresh live rates
            </Button>
            <Button
              size="sm"
              onClick={openCreate}
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
            >
              New currency
            </Button>
          </>
        }
      />

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Code or name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          fieldSize="sm"
          label="Status"
          options={ACTIVE_OPTIONS}
          value={activeFilter}
          onChange={(event) => {
            setPage(1);
            setActiveFilter(event.target.value as ActiveFilter);
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
          emptyTitle="No currencies found"
          emptyDescription="No currencies match these filters."
        >
          <Table>
            <THead>
              <TH>Currency</TH>
              <TH>Rate</TH>
              <TH>Live rate</TH>
              <TH>Status</TH>
              <TH>Live rate fetched</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item) => {
                const isBase = item.code === BASE_CURRENCY_CODE;

                return (
                  <TR key={item.id}>
                    <TD>
                      <span className="block text-text-primary font-medium">
                        {item.code}{" "}
                        <span className="text-text-muted">{item.symbol}</span>
                      </span>
                      <span className="block text-text-muted text-xs">
                        {item.name}
                      </span>
                    </TD>
                    <TD variant="nowrap" className="tabular-nums">
                      {item.effectiveRateFromUsd !== undefined ? (
                        <>
                          {item.effectiveRateFromUsd.toLocaleString()}
                          <Badge
                            variant="outline"
                            tone={item.manualRateFromUsd !== undefined ? "brand" : "neutral"}
                            className="ml-2"
                          >
                            {item.manualRateFromUsd !== undefined ? "Override" : "Live"}
                          </Badge>
                        </>
                      ) : (
                        <Badge tone="warning">No rate yet</Badge>
                      )}
                    </TD>
                    <TD variant="nowrap" className="tabular-nums text-text-secondary">
                      {item.liveRateFromUsd !== undefined
                        ? item.liveRateFromUsd.toLocaleString()
                        : "—"}
                    </TD>
                    <TD>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={item.isActive ? "success" : "neutral"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {isBase && <Badge tone="brand">Base</Badge>}
                      </div>
                    </TD>
                    <TD variant="nowrap">
                      {item.liveRateFetchedAt ? formatDate(item.liveRateFetchedAt) : "—"}
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          icon={<Pencil className="h-4 w-4" />}
                          label={`Edit ${item.code}`}
                          onClick={() => openEdit(item)}
                        />
                        <IconButton
                          icon={<Trash2 className="h-4 w-4" />}
                          label={`Delete ${item.code}`}
                          onClick={() => setDeleteTarget(item)}
                          disabled={isBase}
                          tone="danger"
                        />
                      </div>
                    </TD>
                  </TR>
                );
              })}
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
        <CurrencyFormModal
          key={editing?.id ?? "new"}
          currency={editing}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {}}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete currency"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.code}? Pricing plans still priced in it must move to another currency first.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteCurrencyMutation.isPending}
      />
    </div>
  );
}
