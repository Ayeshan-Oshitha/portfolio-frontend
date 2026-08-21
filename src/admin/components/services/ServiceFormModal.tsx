import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/admin/components/ui/Button";
import Checkbox from "@/admin/components/ui/Checkbox";
import Input from "@/admin/components/ui/Input";
import Modal from "@/admin/components/ui/Modal";
import Textarea from "@/admin/components/ui/Textarea";
import ServiceFeaturesEditor from "@/admin/components/services/ServiceFeaturesEditor";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useAddServiceFeature,
  useCreateService,
  useDeleteServiceFeature,
  useUpdateService,
  useUpdateServiceFeature,
} from "@/admin/hooks/useServices";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import type {
  AdminService,
  ServiceFeature,
  ServiceWriteRequest,
} from "@/admin/types";
import {
  serviceSchema,
  type ServiceFeatureValues,
  type ServiceFormValues,
} from "@/admin/validation/serviceSchemas";

interface ServiceFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly service: AdminService | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: ServiceFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  iconName: "",
  iconCloudinaryId: "",
  heroImageId: "",
  isPublished: false,
  showOnAgency: true,
  featuredOnAgency: false,
  agencySortOrder: 0,
  showOnPersonal: false,
  featuredOnPersonal: false,
  personalSortOrder: 0,
  features: [],
};

function toFormValues(service: AdminService | null): ServiceFormValues {
  if (!service) return BLANK_VALUES;

  return {
    name: service.name,
    slug: service.slug,
    shortDescription: service.shortDescription,
    description: service.description,
    iconName: service.iconName ?? "",
    iconCloudinaryId: service.iconCloudinaryId ?? "",
    heroImageId: service.heroImageId ?? "",
    isPublished: service.isPublished,
    showOnAgency: service.showOnAgency,
    featuredOnAgency: service.featuredOnAgency,
    agencySortOrder: service.agencySortOrder,
    showOnPersonal: service.showOnPersonal,
    featuredOnPersonal: service.featuredOnPersonal,
    personalSortOrder: service.personalSortOrder,
    // Already ordered by the API; the array index becomes `sortOrder` on save.
    features: service.features.map((feature) => ({
      id: feature.id,
      title: feature.title,
      description: feature.description ?? "",
      iconName: feature.iconName ?? "",
    })),
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Features live behind their own endpoints and need a saved service id, so
 * they are reconciled after the service itself is written: drop what the form
 * no longer has, then write every remaining row with its index as `sortOrder`
 * (which is why the dedicated features-reorder endpoint is not needed here).
 */
interface SyncFeaturesDeps {
  readonly addFeature: ReturnType<typeof useAddServiceFeature>["mutateAsync"];
  readonly updateFeature: ReturnType<
    typeof useUpdateServiceFeature
  >["mutateAsync"];
  readonly deleteFeature: ReturnType<
    typeof useDeleteServiceFeature
  >["mutateAsync"];
}

async function syncFeatures(
  serviceId: string,
  next: readonly ServiceFeatureValues[],
  previous: readonly ServiceFeature[],
  { addFeature, updateFeature, deleteFeature }: SyncFeaturesDeps,
): Promise<void> {
  const kept = new Set(
    next.map((feature) => feature.id).filter((id): id is string => Boolean(id)),
  );

  for (const stale of previous) {
    if (!kept.has(stale.id)) {
      await deleteFeature({ serviceId, featureId: stale.id });
    }
  }

  for (const [index, feature] of next.entries()) {
    const body = {
      title: feature.title.trim(),
      description: blank(feature.description),
      iconName: blank(feature.iconName),
      sortOrder: index,
    };

    if (feature.id) {
      await updateFeature({ serviceId, featureId: feature.id, body });
    } else {
      await addFeature({ serviceId, body });
    }
  }
}

/**
 * Mounted only while the dialog is open, and keyed on the service by
 * `ServicesPage`, so the form state starts fresh for every row.
 */
export default function ServiceFormModal({
  service,
  onClose,
  onSaved,
}: ServiceFormModalProps) {
  const toast = useToast();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const addFeatureMutation = useAddServiceFeature();
  const updateFeatureMutation = useUpdateServiceFeature();
  const deleteFeatureMutation = useDeleteServiceFeature();
  const isSaving =
    createServiceMutation.isPending || updateServiceMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<ServiceFormValues>(
    `service-form:${service?.id ?? "new"}`,
    {
      resolver: zodResolver(serviceSchema),
      defaultValues: toFormValues(service),
    },
  );

  const name = useWatch({ control, name: "name" });
  const showOnAgency = useWatch({ control, name: "showOnAgency" });
  const showOnPersonal = useWatch({ control, name: "showOnPersonal" });

  // The API derives the slug from the name whenever the field is left empty.
  const slugPreview = slugify(name ?? "");

  async function onSubmit(values: ServiceFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field resets to default.
    const body: ServiceWriteRequest = {
      name: values.name.trim(),
      slug: blank(values.slug),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      iconName: blank(values.iconName),
      iconCloudinaryId: blank(values.iconCloudinaryId),
      heroImageId: blank(values.heroImageId),
      isPublished: values.isPublished,
      showOnAgency: values.showOnAgency,
      featuredOnAgency: values.featuredOnAgency,
      agencySortOrder: values.agencySortOrder,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.featuredOnPersonal,
      personalSortOrder: values.personalSortOrder,
    };

    try {
      const saved = service
        ? await updateServiceMutation.mutateAsync({ id: service.id, body })
        : await createServiceMutation.mutateAsync(body);

      await syncFeatures(saved.id, values.features, service?.features ?? [], {
        addFeature: addFeatureMutation.mutateAsync,
        updateFeature: updateFeatureMutation.mutateAsync,
        deleteFeature: deleteFeatureMutation.mutateAsync,
      });

      toast.success(service ? "Service updated." : "Service created.");
      clearPersisted();
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setError("slug", { type: "server", message: error.message });
        return;
      }
      // Dialog stays open so a half-applied feature sync can be retried, not lost.
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={service ? "Edit service" : "New service"}
      description={
        service
          ? "Every field is sent on save — the API replaces the whole service."
          : "A service is one offering; its pricing tiers hang off it."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Name"
          required
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Slug"
          placeholder={slugPreview || "generated-from-the-name"}
          error={errors.slug?.message}
          {...register("slug")}
        />

        <Textarea
          label="Short description"
          required
          rows={2}
          placeholder="The card text on the services grid."
          error={errors.shortDescription?.message}
          {...register("shortDescription")}
        />

        <Textarea
          label="Description"
          required
          rows={10}
          placeholder="Markdown — the service page body."
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="flex gap-4">
          <Input
            label="Icon name"
            placeholder="Lucide icon key, e.g. Code"
            containerClassName="flex-1"
            error={errors.iconName?.message}
            {...register("iconName")}
          />

          <Input
            label="Icon Cloudinary id"
            placeholder="portfolio/services/…"
            containerClassName="flex-1"
            error={errors.iconCloudinaryId?.message}
            {...register("iconCloudinaryId")}
          />
        </div>

        <Input
          label="Hero image id"
          placeholder="Cloudinary public_id, e.g. portfolio/services/…"
          error={errors.heroImageId?.message}
          {...register("heroImageId")}
        />

        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <ServiceFeaturesEditor
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              errors={field.value.map(
                (_, index) => errors.features?.[index]?.title?.message,
              )}
            />
          )}
        />

        <div className="pt-4 border-t border-border-subtle">
          <Checkbox
            label="Published"
            hint="Drafts stay out of the public services endpoints."
            {...register("isPublished")}
          />
        </div>

        <fieldset className="pt-4 border-t border-border-subtle space-y-4">
          <legend className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
            Agency site
          </legend>

          <Checkbox label="Show on agency" {...register("showOnAgency")} />

          <div className="flex items-center gap-6 pl-7">
            <Checkbox
              label="Featured"
              disabled={!showOnAgency}
              error={errors.featuredOnAgency?.message}
              {...register("featuredOnAgency")}
            />
            <Input
              label="Order"
              type="number"
              step={1}
              disabled={!showOnAgency}
              containerClassName="w-28"
              error={errors.agencySortOrder?.message}
              {...register("agencySortOrder", { valueAsNumber: true })}
            />
          </div>
        </fieldset>

        <fieldset className="pt-4 border-t border-border-subtle space-y-4">
          <legend className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
            Personal site
          </legend>

          <Checkbox label="Show on personal" {...register("showOnPersonal")} />

          <div className="flex items-center gap-6 pl-7">
            <Checkbox
              label="Featured"
              disabled={!showOnPersonal}
              error={errors.featuredOnPersonal?.message}
              {...register("featuredOnPersonal")}
            />
            <Input
              label="Order"
              type="number"
              step={1}
              disabled={!showOnPersonal}
              containerClassName="w-28"
              error={errors.personalSortOrder?.message}
              {...register("personalSortOrder", { valueAsNumber: true })}
            />
          </div>
        </fieldset>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(service));
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
              : service
                ? "Save changes"
                : "Create service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
