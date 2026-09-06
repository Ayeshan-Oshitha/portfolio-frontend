import { useRef } from "react";
import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateCurrency,
  useUpdateCurrency,
} from "@/admin/hooks/useCurrencies";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminCurrency, CurrencyWriteRequest } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import {
  BASE_CURRENCY_CODE,
  currencySchema,
  type CurrencyFormValues,
} from "@/admin/validation/currencySchemas";
import {
  CURRENCY_PICKER_SUPPORTED,
  currencyCodeOptions,
  currencyName,
  currencySymbol,
} from "@/admin/utils/currencyMeta";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  Modal,
} from "@/admin/components/ui";

interface CurrencyFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly currency: AdminCurrency | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: CurrencyFormValues = {
  code: "",
  name: "",
  symbol: "",
  manualRateFromUsd: undefined,
  isActive: true,
};

function toFormValues(currency: AdminCurrency | null): CurrencyFormValues {
  if (!currency) return BLANK_VALUES;

  return {
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    manualRateFromUsd: currency.manualRateFromUsd,
    isActive: currency.isActive,
  };
}

/** A blank number field must arrive as `undefined` — "use the live rate" — not `NaN` or `0`. */
function toOptionalNumber(raw: unknown): number | undefined {
  if (raw === "" || raw === null || raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Mounted only while the dialog is open, and keyed on the currency by
 * `CurrenciesPage`, so the form state starts fresh for every row.
 */
export default function CurrencyFormModal({
  currency,
  onClose,
  onSaved,
}: CurrencyFormModalProps) {
  const toast = useToast();
  const createCurrencyMutation = useCreateCurrency();
  const updateCurrencyMutation = useUpdateCurrency();
  const isSaving =
    createCurrencyMutation.isPending || updateCurrencyMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    control,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<CurrencyFormValues>(
    `currency-form:${currency?.id ?? "new"}`,
    {
      resolver: zodResolver(currencySchema),
      defaultValues: toFormValues(currency),
    },
  );

  const code = useWatch({ control, name: "code" });
  // The base can't be renamed, re-rated or deactivated — the API refuses all three.
  const isBase = currency?.code === BASE_CURRENCY_CODE;
  const manualRate = useWatch({ control, name: "manualRateFromUsd" });

  /*
   * What the last picked code would have filled in, so a field the admin edited by hand is left
   * alone while an untouched one keeps following the picker.
   *
   * On edit this is seeded from the row's own code rather than left blank: a stored name that
   * still matches what Intl derives was never hand-written, so switching LKR to AUD should carry
   * the name and symbol along with it. A genuinely custom name doesn't match, and survives.
   */
  const autoFilled = useRef(
    currency
      ? { name: currencyName(currency.code), symbol: currencySymbol(currency.code) }
      : { name: "", symbol: "" },
  );

  /** Fills name and symbol from the picked code, without clobbering a deliberate edit. */
  function handleCodeChange(next: string) {
    setValue("code", next, { shouldDirty: true, shouldValidate: true });
    if (!next) return;

    const derived = { name: currencyName(next), symbol: currencySymbol(next) };

    for (const field of ["name", "symbol"] as const) {
      const current = (getValues(field) ?? "").trim();

      if (current === "" || current === autoFilled.current[field]) {
        setValue(field, derived[field], { shouldDirty: true, shouldValidate: true });
      }
    }

    autoFilled.current = derived;
  }

  async function onSubmit(values: CurrencyFormValues) {
    const body: CurrencyWriteRequest = {
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      symbol: values.symbol.trim(),
      manualRateFromUsd: values.manualRateFromUsd,
      isActive: values.isActive,
    };

    try {
      if (currency) {
        await updateCurrencyMutation.mutateAsync({ id: currency.id, body });
        toast.success("Currency updated.");
      } else {
        await createCurrencyMutation.mutateAsync(body);
        toast.success("Currency created.");
      }
      clearPersisted();
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.code === "code_taken") {
        setError("code", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  const upperCode = (code ?? "").trim().toUpperCase();
  // What a visitor would actually see right now: the override if one's being typed, else the
  // last-fetched live rate — mirrors the API's `EffectiveRateFromUsd`.
  const effectiveRate = manualRate ?? currency?.liveRateFromUsd;
  const usingLive = manualRate === undefined && currency?.liveRateFromUsd !== undefined;
  const ratePreview =
    Number.isFinite(effectiveRate) && effectiveRate! > 0 && upperCode && upperCode !== BASE_CURRENCY_CODE
      ? `$100 shows as ${(100 * effectiveRate!).toLocaleString()} ${upperCode}${usingLive ? " (using the actual price)" : ""}`
      : null;

  return (
    <Modal
      open
      onClose={onClose}
      title={currency ? `Edit ${currency.code}` : "New currency"}
      description={
        isBase
          ? `${BASE_CURRENCY_CODE} is the base every other rate is expressed against — only its name and symbol can change.`
          : "Set a price yourself, or leave it blank to use the actual price from the last refresh."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="flex gap-4">
          {CURRENCY_PICKER_SUPPORTED ? (
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Combobox
                  label="Code"
                  required
                  placeholder="Select…"
                  searchPlaceholder="Search by code or name…"
                  options={currencyCodeOptions()}
                  value={field.value}
                  onChange={handleCodeChange}
                  disabled={isBase}
                  containerClassName="w-56"
                  error={errors.code?.message}
                />
              )}
            />
          ) : (
            // Safari < 15.4 has no Intl.supportedValuesOf — same free-text field as before.
            <Input
              label="Code"
              required
              autoFocus={!isBase}
              maxLength={3}
              placeholder="LKR"
              disabled={isBase}
              containerClassName="w-28"
              className="uppercase"
              error={errors.code?.message}
              {...register("code")}
            />
          )}

          <Input
            label="Name"
            required
            placeholder="Sri Lankan Rupee"
            containerClassName="flex-1"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Symbol"
            required
            maxLength={10}
            placeholder="Rs"
            containerClassName="w-24"
            error={errors.symbol?.message}
            {...register("symbol")}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <span className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Actual price
            </span>
            <div className="flex h-11 items-center rounded-lg border border-border-subtle bg-surface-800 px-3.5 text-sm text-text-secondary">
              {currency?.liveRateFromUsd
                ? `${currency.liveRateFromUsd.toLocaleString()} per USD`
                : "Not fetched yet"}
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              {currency?.liveRateFetchedAt
                ? `As of ${formatDate(currency.liveRateFetchedAt)}`
                : "Refresh live rates from the Currencies page to fetch one."}
            </p>
          </div>

          <Input
            label="Price set by me"
            type="number"
            step="0.000001"
            min={0}
            placeholder={isBase ? undefined : "Uses the actual price"}
            disabled={isBase}
            containerClassName="flex-1"
            hint={
              ratePreview ??
              (isBase
                ? "The base is always 1."
                : "Leave blank to always use the actual price.")
            }
            error={errors.manualRateFromUsd?.message}
            {...register("manualRateFromUsd", { setValueAs: toOptionalNumber })}
          />
        </div>

        <Checkbox
          label="Active"
          hint="Active currencies appear in the switcher on the public sites."
          disabled={isBase}
          {...register("isActive")}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(currency));
              clearPersisted();
            }}
            disabled={isSubmitting || isSaving}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting || isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting || isSaving}>
            {isSubmitting || isSaving
              ? "Saving…"
              : currency
                ? "Save changes"
                : "Create currency"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
