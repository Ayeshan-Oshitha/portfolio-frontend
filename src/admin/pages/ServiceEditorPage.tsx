import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ServiceImageField, {
  type ServiceImageValue,
} from "@/admin/components/services/ServiceImageField";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateService,
  useService,
  useUpdateService,
} from "@/admin/hooks/useServices";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import type { AdminService, ServiceWriteRequest } from "@/admin/types";
import {
  serviceSchema,
  type ServiceFormValues,
} from "@/admin/validation/serviceSchemas";
import {
  Alert,
  BackLink,
  Button,
  Checkbox,
  Input,
  MarkdownField,
  PageHeader,
  ProjectPicker,
  Spinner,
  Textarea,
} from "@/admin/components/ui";

type TabId = "details" | "page-content" | "media" | "projects" | "seo";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "page-content", label: "Page content" },
  { id: "media", label: "Media" },
  { id: "projects", label: "Projects" },
  { id: "seo", label: "SEO & publish" },
];

/**
 * Which fields live under which tab, so a tab can flag that it is hiding an
 * error. Every panel stays mounted, so validation still fires regardless of
 * which tab is showing — this only drives the dot.
 */
const TAB_FIELDS: Record<TabId, readonly (keyof ServiceFormValues)[]> = {
  details: ["name", "slug", "shortDescription"],
  "page-content": [
    "eyebrow",
    "headline",
    "deck",
    "whoThisIsFor",
    "outcomes",
    "capabilities",
    "inDepth",
    "primaryCtaLabel",
    "primaryCtaUrl",
    "secondaryCtaLabel",
    "secondaryCtaUrl",
  ],
  media: [],
  projects: ["projectIds"],
  seo: ["isPublished", "seoTitle", "seoDescription"],
};

const TAB_BASE =
  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer";

function blankValues(): ServiceFormValues {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    eyebrow: "",
    headline: "",
    deck: "",
    whoThisIsFor: "",
    outcomes: "",
    capabilities: "",
    inDepth: "",
    primaryCtaLabel: "",
    primaryCtaUrl: "",
    secondaryCtaLabel: "",
    secondaryCtaUrl: "",
    iconObjectKey: "",
    iconUrl: "",
    iconWidth: undefined,
    iconHeight: undefined,
    iconAltText: "",
    heroImageObjectKey: "",
    heroImageUrl: "",
    heroImageWidth: undefined,
    heroImageHeight: undefined,
    heroImageAltText: "",
    depthImageObjectKey: "",
    depthImageUrl: "",
    depthImageWidth: undefined,
    depthImageHeight: undefined,
    depthImageAltText: "",
    projectIds: [],
    seoTitle: "",
    seoDescription: "",
    isPublished: false,
  };
}

function toFormValues(service: AdminService | null): ServiceFormValues {
  if (!service) return blankValues();

  return {
    name: service.name,
    slug: service.slug,
    shortDescription: service.shortDescription,
    eyebrow: service.eyebrow ?? "",
    headline: service.headline ?? "",
    deck: service.deck ?? "",
    whoThisIsFor: service.whoThisIsFor ?? "",
    outcomes: service.outcomes ?? "",
    capabilities: service.capabilities ?? "",
    inDepth: service.inDepth ?? "",
    primaryCtaLabel: service.primaryCtaLabel ?? "",
    primaryCtaUrl: service.primaryCtaUrl ?? "",
    secondaryCtaLabel: service.secondaryCtaLabel ?? "",
    secondaryCtaUrl: service.secondaryCtaUrl ?? "",
    iconObjectKey: service.iconObjectKey ?? "",
    iconUrl: service.iconUrl ?? "",
    iconWidth: service.iconWidth,
    iconHeight: service.iconHeight,
    iconAltText: service.iconAltText ?? "",
    heroImageObjectKey: service.heroImageObjectKey ?? "",
    heroImageUrl: service.heroImageUrl ?? "",
    heroImageWidth: service.heroImageWidth,
    heroImageHeight: service.heroImageHeight,
    heroImageAltText: service.heroImageAltText ?? "",
    depthImageObjectKey: service.depthImageObjectKey ?? "",
    depthImageUrl: service.depthImageUrl ?? "",
    depthImageWidth: service.depthImageWidth,
    depthImageHeight: service.depthImageHeight,
    depthImageAltText: service.depthImageAltText ?? "",
    projectIds: service.projects.map((project) => project.id),
    seoTitle: service.seoTitle ?? "",
    seoDescription: service.seoDescription ?? "",
    isPublished: service.isPublished,
  };
}

function toImageValue(
  objectKey?: string,
  url?: string,
  width?: number,
  height?: number,
  altText?: string,
): ServiceImageValue | null {
  return objectKey && url
    ? { objectKey, url, width: width ?? 0, height: height ?? 0, altText: altText ?? "" }
    : null;
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Serves both `/admin/services/new` and `/admin/services/:id`. A service now
 * carries a full page's worth of content plus three image slots and a
 * project picker — too much for the modal it used to live in, so it gets its
 * own route with tabbed panels, the same shape `ProjectEditorPage` uses.
 */
export default function ServiceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: service,
    isPending: isLoading,
    error: queryError,
  } = useService(id);
  const loadError = queryError ? toErrorMessage(queryError) : null;

  if (id && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-primary-400">
        <Spinner className="h-6 w-6" label="Loading service" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <Alert className="mb-6">{loadError}</Alert>
        <Button href="/admin/services" variant="outline" size="sm">
          Back to services
        </Button>
      </div>
    );
  }

  // Keyed so navigating to a different service remounts the form instead of reusing stale defaults.
  return (
    <ServiceForm
      key={service?.id ?? "new"}
      service={service ?? null}
      onDone={() => navigate("/admin/services")}
    />
  );
}

interface ServiceFormProps {
  /** `null` puts the form in create mode. */
  readonly service: AdminService | null;
  readonly onDone: () => void;
}

function ServiceForm({ service, onDone }: ServiceFormProps) {
  const [tab, setTab] = useState<TabId>("details");
  const toast = useToast();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const isSaving =
    createServiceMutation.isPending || updateServiceMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
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
  const icon = useWatch({
    control,
    name: ["iconObjectKey", "iconUrl", "iconWidth", "iconHeight", "iconAltText"],
  });
  const heroImage = useWatch({
    control,
    name: [
      "heroImageObjectKey",
      "heroImageUrl",
      "heroImageWidth",
      "heroImageHeight",
      "heroImageAltText",
    ],
  });
  const depthImage = useWatch({
    control,
    name: [
      "depthImageObjectKey",
      "depthImageUrl",
      "depthImageWidth",
      "depthImageHeight",
      "depthImageAltText",
    ],
  });

  function setImage(
    prefix: "icon" | "heroImage" | "depthImage",
    next: ServiceImageValue | null,
  ) {
    setValue(`${prefix}ObjectKey`, next?.objectKey ?? "", { shouldDirty: true });
    setValue(`${prefix}Url`, next?.url ?? "", { shouldDirty: true });
    setValue(`${prefix}Width`, next?.width, { shouldDirty: true });
    setValue(`${prefix}Height`, next?.height, { shouldDirty: true });
    setValue(`${prefix}AltText`, next?.altText ?? "", { shouldDirty: true });
  }

  const tabsWithErrors = useMemo(() => {
    const flagged = new Set<TabId>();
    for (const { id } of TABS) {
      if (TAB_FIELDS[id].some((field) => errors[field])) flagged.add(id);
    }
    return flagged;
  }, [errors]);

  async function onSubmit(values: ServiceFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so
    // any omitted field would reset to default. Show/featured/sort carry
    // forward from the loaded service — they're edited from Reorder & Visibility.
    const body: ServiceWriteRequest = {
      name: values.name.trim(),
      slug: blank(values.slug),
      shortDescription: values.shortDescription.trim(),
      eyebrow: blank(values.eyebrow),
      headline: blank(values.headline),
      deck: blank(values.deck),
      whoThisIsFor: blank(values.whoThisIsFor),
      outcomes: blank(values.outcomes),
      capabilities: blank(values.capabilities),
      inDepth: blank(values.inDepth),
      primaryCtaLabel: blank(values.primaryCtaLabel),
      primaryCtaUrl: blank(values.primaryCtaUrl),
      secondaryCtaLabel: blank(values.secondaryCtaLabel),
      secondaryCtaUrl: blank(values.secondaryCtaUrl),
      iconObjectKey: blank(values.iconObjectKey),
      iconUrl: blank(values.iconUrl),
      iconWidth: values.iconWidth,
      iconHeight: values.iconHeight,
      iconAltText: blank(values.iconAltText),
      heroImageObjectKey: blank(values.heroImageObjectKey),
      heroImageUrl: blank(values.heroImageUrl),
      heroImageWidth: values.heroImageWidth,
      heroImageHeight: values.heroImageHeight,
      heroImageAltText: blank(values.heroImageAltText),
      depthImageObjectKey: blank(values.depthImageObjectKey),
      depthImageUrl: blank(values.depthImageUrl),
      depthImageWidth: values.depthImageWidth,
      depthImageHeight: values.depthImageHeight,
      depthImageAltText: blank(values.depthImageAltText),
      projectIds: values.projectIds,
      seoTitle: blank(values.seoTitle),
      seoDescription: blank(values.seoDescription),
      isPublished: values.isPublished,
      showOnAgency: service?.showOnAgency ?? false,
      featuredOnAgency: service?.featuredOnAgency ?? false,
      agencySortOrder: service?.agencySortOrder ?? 0,
      showOnPersonal: service?.showOnPersonal ?? false,
      featuredOnPersonal: service?.featuredOnPersonal ?? false,
      personalSortOrder: service?.personalSortOrder ?? 0,
    };

    try {
      if (service) {
        await updateServiceMutation.mutateAsync({ id: service.id, body });
      } else {
        await createServiceMutation.mutateAsync(body);
      }
      toast.success(service ? "Service updated." : "Service created.");
      clearPersisted();
      onDone();
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setTab("details");
        setError("slug", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  const slugPreview = slugify(name ?? "");

  return (
    <div className="max-w-3xl">
      <BackLink to="/admin/services">Services</BackLink>

      <PageHeader
        title={service ? "Edit service" : "New service"}
        description={
          service
            ? "Every field is sent on save — the API replaces the whole service. Order and visibility are managed from Reorder & Visibility."
            : "A service is one offering; its pricing tiers and page content hang off it."
        }
      />

      {/* Panels are hidden, never unmounted, so an error on another tab still blocks submit and shows its dot. */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          role="tablist"
          aria-label="Service sections"
          className="flex items-center gap-1 mb-6 border-b border-border-subtle pb-3"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`${TAB_BASE} ${
                tab === id
                  ? "bg-primary-600/10 text-primary-400"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-800"
              }`}
            >
              {label}
              {tabsWithErrors.has(id) && (
                <span
                  aria-label="has errors"
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-danger-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className={tab === "details" ? "space-y-5" : "hidden"}>
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

          <Controller
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <MarkdownField
                label="Short description"
                required
                value={field.value}
                onChange={field.onChange}
                error={errors.shortDescription?.message}
                hint="Markdown — the card blurb, and the page body when the fields on the next tab are empty."
                height={180}
              />
            )}
          />
        </div>

        <div className={tab === "page-content" ? "space-y-5" : "hidden"}>
          <p className="text-sm text-text-muted">
            All optional — the service page falls back to the name and short
            description when these are empty.
          </p>

          <Input
            label="Eyebrow"
            placeholder='e.g. "Arizona · Website pages"'
            error={errors.eyebrow?.message}
            {...register("eyebrow")}
          />

          <Input
            label="Headline"
            placeholder={service?.name || "Falls back to the name"}
            error={errors.headline?.message}
            {...register("headline")}
          />

          <Textarea
            label="Deck"
            rows={2}
            placeholder="The paragraph under the headline"
            error={errors.deck?.message}
            {...register("deck")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary CTA label"
              error={errors.primaryCtaLabel?.message}
              {...register("primaryCtaLabel")}
            />
            <Input
              label="Primary CTA URL"
              error={errors.primaryCtaUrl?.message}
              {...register("primaryCtaUrl")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Secondary CTA label"
              error={errors.secondaryCtaLabel?.message}
              {...register("secondaryCtaLabel")}
            />
            <Input
              label="Secondary CTA URL"
              error={errors.secondaryCtaUrl?.message}
              {...register("secondaryCtaUrl")}
            />
          </div>

          <Controller
            control={control}
            name="whoThisIsFor"
            render={({ field }) => (
              <MarkdownField
                label="Who this is for"
                hint="Markdown bullet list."
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.whoThisIsFor?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="outcomes"
            render={({ field }) => (
              <MarkdownField
                label="What you walk away with"
                hint="Markdown bullet list."
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.outcomes?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="capabilities"
            render={({ field }) => (
              <MarkdownField
                label="What you get"
                hint="Markdown bullet list."
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.capabilities?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="inDepth"
            render={({ field }) => (
              <MarkdownField
                label="In depth"
                hint="Markdown — the long-form prose block, next to the depth image."
                height={260}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.inDepth?.message}
              />
            )}
          />
        </div>

        <div className={tab === "media" ? "space-y-5" : "hidden"}>
          <ServiceImageField
            label="Icon"
            hint="A small square icon shown alongside the service."
            value={toImageValue(...icon)}
            onChange={(next) => setImage("icon", next)}
          />

          <ServiceImageField
            label="Hero image"
            hint="The banner image at the top of the service page."
            value={toImageValue(...heroImage)}
            onChange={(next) => setImage("heroImage", next)}
          />

          <ServiceImageField
            label="Depth image"
            hint="Shown next to the 'In depth' section."
            value={toImageValue(...depthImage)}
            onChange={(next) => setImage("depthImage", next)}
          />
        </div>

        <div className={tab === "projects" ? "space-y-5" : "hidden"}>
          <Controller
            control={control}
            name="projectIds"
            render={({ field, fieldState }) => (
              <ProjectPicker
                label="Case studies"
                value={field.value}
                onChange={field.onChange}
                hint="Shown as 'Real work' on this service's page. Saved as a complete set — removing a chip unlinks the project."
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className={tab === "seo" ? "space-y-5" : "hidden"}>
          <Checkbox
            label="Published"
            hint="Drafts stay out of the public services endpoints. Publishing for the first time makes the service visible on both sites — dial that back on Reorder & Visibility."
            {...register("isPublished")}
          />

          <Input
            label="SEO title"
            placeholder="Falls back to the service name"
            error={errors.seoTitle?.message}
            {...register("seoTitle")}
          />

          <Textarea
            label="SEO description"
            rows={3}
            placeholder="Falls back to the short description"
            error={errors.seoDescription?.message}
            {...register("seoDescription")}
          />
        </div>

        <div className="sticky bottom-0 mt-6 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-surface-950/90 backdrop-blur border-t border-border-subtle">
          {tabsWithErrors.size > 0 && (
            <p className="mb-4 text-xs text-danger-400">
              Some fields need attention — the dotted tabs above have errors.
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
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
              onClick={onDone}
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
        </div>
      </form>
    </div>
  );
}
