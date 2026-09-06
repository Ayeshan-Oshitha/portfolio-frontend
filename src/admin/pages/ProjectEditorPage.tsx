import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProjectImagesEditor from "@/admin/components/projects/ProjectImagesEditor";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/admin/hooks/useProjects";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import type { AdminProject, ProjectWriteRequest } from "@/admin/types";
import {
  projectSchema,
  type ProjectFormValues,
} from "@/admin/validation/projectSchemas";
import {
  Alert,
  BackLink,
  Button,
  Checkbox,
  Input,
  MarkdownField,
  PageHeader,
  Spinner,
  TagPicker,
  Textarea,
} from "@/admin/components/ui";

type TabId = "details" | "case-study" | "gallery" | "visibility";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "case-study", label: "Case study" },
  { id: "gallery", label: "Gallery" },
  { id: "visibility", label: "Visibility & SEO" },
];

/**
 * Which fields live under which tab, so a tab can flag that it is hiding an
 * error. Every panel stays mounted, so validation fires regardless of which
 * tab is showing — this only drives the dot.
 */
const TAB_FIELDS: Record<TabId, readonly (keyof ProjectFormValues)[]> = {
  details: [
    "title",
    "slug",
    "year",
    "clientName",
    "websiteUrl",
    "shortDescription",
    "description",
    "tagIds",
  ],
  "case-study": ["problem", "solution", "whatWeDelivered", "proof"],
  gallery: [],
  visibility: ["isPublished", "seoTitle", "seoDescription"],
};

const TAB_BASE =
  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer";

/** Built fresh per mount so a new project defaults to this year, not load time. */
function blankValues(): ProjectFormValues {
  return {
    title: "",
    slug: "",
    year: new Date().getFullYear(),
    shortDescription: "",
    description: "",
    websiteUrl: "",
    problem: "",
    solution: "",
    whatWeDelivered: "",
    proof: "",
    clientName: "",
    isPublished: false,
    seoTitle: "",
    seoDescription: "",
    showOnAgency: false,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
    tagIds: [],
  };
}

/**
 * The response carries whole tags while the request wants bare ids, so the
 * relation is flattened on the way into the form. Absent optional strings
 * become `""` — that is the shape an untouched field has in the form.
 */
function toFormValues(project: AdminProject | null): ProjectFormValues {
  if (!project) return blankValues();

  return {
    title: project.title,
    slug: project.slug,
    year: project.year,
    shortDescription: project.shortDescription,
    description: project.description,
    websiteUrl: project.websiteUrl ?? "",
    problem: project.problem ?? "",
    solution: project.solution ?? "",
    whatWeDelivered: project.whatWeDelivered ?? "",
    proof: project.proof ?? "",
    clientName: project.clientName ?? "",
    isPublished: project.isPublished,
    seoTitle: project.seoTitle ?? "",
    seoDescription: project.seoDescription ?? "",
    showOnAgency: project.showOnAgency,
    featuredOnAgency: project.featuredOnAgency,
    showOnPersonal: project.showOnPersonal,
    featuredOnPersonal: project.featuredOnPersonal,
    tagIds: project.tags.map((tag) => tag.id),
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Serves both `/admin/projects/new` and `/admin/projects/:id`. A project has
 * far more fields than the other content types, so it gets its own route with
 * tabbed panels rather than the modal the smaller entities use.
 */
export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Set by the create flow below, so a brand-new project can land straight on
  // the Gallery tab instead of the user having to find and click it.
  const location = useLocation();
  const initialTab = (location.state as { openTab?: TabId } | null)?.openTab;

  const {
    data: project,
    isPending: isLoading,
    error: queryError,
  } = useProject(id);
  const loadError = queryError ? toErrorMessage(queryError) : null;

  if (id && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-primary-400">
        <Spinner className="h-6 w-6" label="Loading project" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <Alert className="mb-6">{loadError}</Alert>
        <Button href="/admin/projects" variant="outline" size="sm">
          Back to projects
        </Button>
      </div>
    );
  }

  // Keyed so navigating to a different project remounts the form instead of reusing stale defaults.
  return (
    <ProjectForm
      key={project?.id ?? "new"}
      project={project ?? null}
      initialTab={project ? initialTab : undefined}
      onDone={() => navigate("/admin/projects")}
    />
  );
}

interface ProjectFormProps {
  /** `null` puts the form in create mode. */
  readonly project: AdminProject | null;
  /** Where to land after a create redirected here — usually "gallery". */
  readonly initialTab?: TabId;
  readonly onDone: () => void;
}

function ProjectForm({ project, initialTab, onDone }: ProjectFormProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>(initialTab ?? "details");
  const toast = useToast();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const isSaving =
    createProjectMutation.isPending || updateProjectMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<ProjectFormValues>(
    `project-form:${project?.id ?? "new"}`,
    {
      resolver: zodResolver(projectSchema),
      defaultValues: toFormValues(project),
    },
  );

  const title = useWatch({ control, name: "title" });

  const tabsWithErrors = useMemo(() => {
    const flagged = new Set<TabId>();
    for (const { id } of TABS) {
      if (TAB_FIELDS[id].some((field) => errors[field])) flagged.add(id);
    }
    return flagged;
  }, [errors]);

  async function onSubmit(values: ProjectFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field would wipe out.
    const body: ProjectWriteRequest = {
      title: values.title.trim(),
      slug: blank(values.slug),
      year: values.year,
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      websiteUrl: blank(values.websiteUrl),
      problem: blank(values.problem),
      solution: blank(values.solution),
      whatWeDelivered: blank(values.whatWeDelivered),
      proof: blank(values.proof),
      clientName: blank(values.clientName),
      isPublished: values.isPublished,
      seoTitle: blank(values.seoTitle),
      seoDescription: blank(values.seoDescription),
      // Show/feature per site are set from the Reorder & Visibility screen, not
      // this form — carried through untouched so saving other fields doesn't reset them.
      showOnAgency: values.showOnAgency,
      featuredOnAgency: values.featuredOnAgency,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.featuredOnPersonal,
      tagIds: values.tagIds,
    };

    try {
      if (project) {
        await updateProjectMutation.mutateAsync({ id: project.id, body });
        toast.success("Project updated.");
        clearPersisted();
        onDone();
      } else {
        const created = await createProjectMutation.mutateAsync(body);
        toast.success("Project created — add gallery images below.");
        clearPersisted();
        // Straight into edit mode on the Gallery tab, not the list — a brand
        // new project has no gallery until it has an id, so this is the
        // earliest point images can be added.
        navigate(`/admin/projects/${created.id}`, {
          state: { openTab: "gallery" },
        });
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setTab("details");
        setError("slug", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  const slugPreview = slugify(title ?? "");

  return (
    <div className="max-w-3xl">
      <BackLink to="/admin/projects">Projects</BackLink>

      <PageHeader
        title={project ? "Edit project" : "New project"}
        description={
          project
            ? "Every field is sent on save — the API replaces the whole project."
            : "Long-form case study copy. Markdown is fine in the description fields."
        }
      />

      {/* Panels are hidden, never unmounted, so an error on another tab still blocks submit and shows its dot. */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          role="tablist"
          aria-label="Project sections"
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
            label="Title"
            required
            autoFocus
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex gap-4">
            <Input
              label="Slug"
              placeholder={slugPreview || "generated-from-the-title"}
              containerClassName="flex-1"
              error={errors.slug?.message}
              {...register("slug")}
            />

            <Input
              label="Year"
              type="number"
              step={1}
              required
              containerClassName="w-32"
              error={errors.year?.message}
              {...register("year", { valueAsNumber: true })}
            />
          </div>

          <div className="flex gap-4">
            <Input
              label="Client name"
              containerClassName="flex-1"
              error={errors.clientName?.message}
              {...register("clientName")}
            />

            <Input
              label="Website URL"
              placeholder="https://example.com"
              containerClassName="flex-1"
              error={errors.websiteUrl?.message}
              {...register("websiteUrl")}
            />
          </div>

          <Textarea
            label="Short description"
            required
            rows={3}
            error={errors.shortDescription?.message}
            {...register("shortDescription")}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <MarkdownField
                label="Description"
                required
                height={320}
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tagIds"
            render={({ field, fieldState }) => (
              <TagPicker
                label="Tags & technologies"
                value={field.value}
                onChange={field.onChange}
                hint="Saved as a complete set — removing a chip drops the tag on save."
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className={tab === "case-study" ? "space-y-5" : "hidden"}>
          <p className="text-sm text-text-muted">
            All four are optional and rendered on the public case study page.
          </p>

          <Controller
            control={control}
            name="problem"
            render={({ field }) => (
              <MarkdownField
                label="Problem"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.problem?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="solution"
            render={({ field }) => (
              <MarkdownField
                label="Solution"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.solution?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="whatWeDelivered"
            render={({ field }) => (
              <MarkdownField
                label="What we delivered"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.whatWeDelivered?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="proof"
            render={({ field }) => (
              <MarkdownField
                label="Proof"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.proof?.message}
              />
            )}
          />
        </div>

        <div className={tab === "gallery" ? "space-y-5" : "hidden"}>
          {project ? (
            <ProjectImagesEditor
              projectId={project.id}
              projectSlug={project.slug}
              images={project.images}
            />
          ) : (
            <p className="text-sm text-text-muted">
              Save the project first — images hang off a saved project.
            </p>
          )}
        </div>

        <div className={tab === "visibility" ? "space-y-5" : "hidden"}>
          <Checkbox
            label="Published"
            hint="Drafts stay off both public sites. Once published, use Reorder & Visibility to show it on a site."
            {...register("isPublished")}
          />

          <Input
            label="SEO title"
            placeholder="Falls back to the project title"
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
                reset(toFormValues(project));
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
                : project
                  ? "Save changes"
                  : "Create project"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
