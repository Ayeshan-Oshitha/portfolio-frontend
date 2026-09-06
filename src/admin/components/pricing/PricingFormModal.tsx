import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PricingFeaturesEditor from "@/admin/components/pricing/PricingFeaturesEditor";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useAddPricingPlanFeature,
  useCreatePricingPlan,
  useDeletePricingPlanFeature,
  useUpdatePricingPlan,
  useUpdatePricingPlanFeature,
} from "@/admin/hooks/usePricing";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { priceTypeLabel } from "@/admin/utils/format";
import type {
  AdminPricingPlan,
  AdminService,
  PricingPlanFeature,
  PricingPlanWriteRequest,
} from "@/admin/types";
import {
  PRICE_TYPES,
  pricingPlanSchema,
  type PricingFeatureValues,
  type PricingPlanFormValues,
} from "@/admin/validation/pricingSchemas";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Textarea,
} from "@/admin/components/ui";

interface PricingFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly plan: AdminPricingPlan | null;
  /** Fills the service dropdown; loaded once by `PricingPage`. */
  readonly services: readonly AdminService[];
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const KIND_OPTIONS = [
  { value: "combo", label: "Combo pack" },
  { value: "service", label: "Service tier" },
] as const;

const PRICE_TYPE_OPTIONS = PRICE_TYPES.map((priceType) => ({
  value: priceType,
  label: priceTypeLabel(priceType),
}));

const BLANK_VALUES: PricingPlanFormValues = {
  kind: "combo",
  serviceId: "",
  name: "",
  tagline: "",
  description: "",
  priceType: "starting_from",
  priceAmount: undefined,
  // USD is the base every display rate converts from, and the seeded default.
  currency: "USD",
  deliveryText: "",
  ctaLabel: "",
  ctaUrl: "",
  isPublished: false,
  isPopular: false,
  featured: false,
  features: [],
};

function toFormValues(plan: AdminPricingPlan | null): PricingPlanFormValues {
  if (!plan) return BLANK_VALUES;

  return {
    kind: plan.serviceId ? "service" : "combo",
    serviceId: plan.serviceId ?? "",
    name: plan.name,
    tagline: plan.tagline ?? "",
    description: plan.description,
    priceType: plan.priceType,
    priceAmount: plan.priceAmount,
    currency: plan.currency,
    deliveryText: plan.deliveryText ?? "",
    ctaLabel: plan.ctaLabel ?? "",
    ctaUrl: plan.ctaUrl ?? "",
    isPublished: plan.isPublished,
    isPopular: plan.isPopular,
    featured: plan.featured,
    // Already ordered by the API; the array index becomes `sortOrder` on save.
    features: plan.features.map((feature) => ({
      id: feature.id,
      text: feature.text,
      isIncluded: feature.isIncluded,
    })),
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** A blank number field must arrive as `undefined`, not `NaN` or `0`. */
function toOptionalNumber(raw: unknown): number | undefined {
  if (raw === "" || raw === null || raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Features live behind their own endpoints and need a saved plan id, so they
 * are reconciled after the plan itself is written: drop what the form no
 * longer has, then write every remaining row with its index as `sortOrder`
 * (which is why the dedicated features-reorder endpoint is not needed here).
 */
interface SyncFeaturesDeps {
  readonly addFeature: ReturnType<
    typeof useAddPricingPlanFeature
  >["mutateAsync"];
  readonly updateFeature: ReturnType<
    typeof useUpdatePricingPlanFeature
  >["mutateAsync"];
  readonly deleteFeature: ReturnType<
    typeof useDeletePricingPlanFeature
  >["mutateAsync"];
}

async function syncFeatures(
  planId: string,
  next: readonly PricingFeatureValues[],
  previous: readonly PricingPlanFeature[],
  { addFeature, updateFeature, deleteFeature }: SyncFeaturesDeps,
): Promise<void> {
  const kept = new Set(
    next.map((feature) => feature.id).filter((id): id is string => Boolean(id)),
  );

  for (const stale of previous) {
    if (!kept.has(stale.id)) {
      await deleteFeature({ planId, featureId: stale.id });
    }
  }

  for (const [index, feature] of next.entries()) {
    const body = {
      text: feature.text.trim(),
      isIncluded: feature.isIncluded,
      sortOrder: index,
    };

    if (feature.id) {
      await updateFeature({ planId, featureId: feature.id, body });
    } else {
      await addFeature({ planId, body });
    }
  }
}

/**
 * Mounted only while the dialog is open, and keyed on the plan by
 * `PricingPage`, so the form state starts fresh for every row.
 */
export default function PricingFormModal({
  plan,
  services,
  onClose,
  onSaved,
}: PricingFormModalProps) {
  const toast = useToast();
  const createPlanMutation = useCreatePricingPlan();
  const updatePlanMutation = useUpdatePricingPlan();
  const addFeatureMutation = useAddPricingPlanFeature();
  const updateFeatureMutation = useUpdatePricingPlanFeature();
  const deleteFeatureMutation = useDeletePricingPlanFeature();
  const isSaving = createPlanMutation.isPending || updatePlanMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<PricingPlanFormValues>(
    `pricing-form:${plan?.id ?? "new"}`,
    {
      resolver: zodResolver(pricingPlanSchema),
      defaultValues: toFormValues(plan),
    },
  );

  const kind = useWatch({ control, name: "kind" });
  const priceType = useWatch({ control, name: "priceType" });

  // A combo pack has no service; the API rejects a `custom` priceType that still carries an amount.
  useEffect(() => {
    if (kind === "combo") setValue("serviceId", "");
  }, [kind, setValue]);

  useEffect(() => {
    if (priceType === "custom") setValue("priceAmount", undefined);
  }, [priceType, setValue]);

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.isPublished ? service.name : `${service.name} (draft)`,
  }));

  async function onSubmit(values: PricingPlanFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field resets to default.
    const body: PricingPlanWriteRequest = {
      serviceId:
        values.kind === "service" ? blank(values.serviceId) : undefined,
      name: values.name.trim(),
      tagline: blank(values.tagline),
      priceAmount:
        values.priceType === "custom" ? undefined : values.priceAmount,
      // Every plan is authored in USD, the fixed base every display rate
      // converts from — there's no per-plan currency picker any more.
      currency: "USD",
      priceType: values.priceType,
      deliveryText: blank(values.deliveryText),
      description: values.description.trim(),
      isPopular: values.isPopular,
      ctaLabel: blank(values.ctaLabel),
      ctaUrl: blank(values.ctaUrl),
      isPublished: values.isPublished,
      featured: values.featured,
    };

    try {
      const saved = plan
        ? await updatePlanMutation.mutateAsync({ id: plan.id, body })
        : await createPlanMutation.mutateAsync(body);

      await syncFeatures(saved.id, values.features, plan?.features ?? [], {
        addFeature: addFeatureMutation.mutateAsync,
        updateFeature: updateFeatureMutation.mutateAsync,
        deleteFeature: deleteFeatureMutation.mutateAsync,
      });

      toast.success(plan ? "Pricing plan updated." : "Pricing plan created.");
      clearPersisted();
      onSaved();
      onClose();
    } catch (error) {
      // Dialog stays open so a half-applied feature sync can be retried, not lost.
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={plan ? "Edit pricing plan" : "New pricing plan"}
      description={
        plan
          ? "Every field is sent on save — the API replaces the whole plan."
          : "A plan is either a combo pack or one tier of a service."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="flex gap-4">
          <Select
            label="Kind"
            options={KIND_OPTIONS}
            containerClassName="w-44"
            {...register("kind")}
          />

          <Select
            label="Service"
            required={kind === "service"}
            placeholder="Select a service"
            options={serviceOptions}
            disabled={kind === "combo"}
            containerClassName="flex-1"
            error={errors.serviceId?.message}
            {...register("serviceId")}
          />
        </div>

        <Input
          label="Name"
          required
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Tagline"
          placeholder="Best for growing teams"
          error={errors.tagline?.message}
          {...register("tagline")}
        />

        <Textarea
          label="Description"
          required
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="flex gap-4">
          <Select
            label="Price type"
            options={PRICE_TYPE_OPTIONS}
            containerClassName="w-44"
            {...register("priceType")}
          />

          <Input
            label="Amount (USD)"
            type="number"
            step="0.01"
            min={0}
            placeholder={priceType === "custom" ? "Contact us" : "2500"}
            disabled={priceType === "custom"}
            containerClassName="flex-1"
            error={errors.priceAmount?.message}
            {...register("priceAmount", { setValueAs: toOptionalNumber })}
          />
        </div>

        <Input
          label="Delivery text"
          placeholder="2–3 weeks"
          error={errors.deliveryText?.message}
          {...register("deliveryText")}
        />

        <div className="flex gap-4">
          <Input
            label="CTA label"
            placeholder="Learn more"
            containerClassName="flex-1"
            error={errors.ctaLabel?.message}
            {...register("ctaLabel")}
          />

          <Input
            label="CTA URL"
            placeholder="/contact"
            containerClassName="flex-1"
            error={errors.ctaUrl?.message}
            {...register("ctaUrl")}
          />
        </div>

        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <PricingFeaturesEditor
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              errors={field.value.map(
                (_, index) => errors.features?.[index]?.text?.message,
              )}
            />
          )}
        />

        <div className="pt-4 border-t border-border-subtle space-y-4">
          <Checkbox
            label="Published"
            hint="Drafts stay out of the public pricing endpoints."
            {...register("isPublished")}
          />

          <Checkbox
            label="Most popular"
            hint="Highlights this plan on the pricing card grid."
            {...register("isPopular")}
          />

          <Checkbox
            label="Featured"
            hint="Shows this plan on the agency home page. Pricing only ever appears on the agency site."
            {...register("featured")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(plan));
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
              : plan
                ? "Save changes"
                : "Create plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
