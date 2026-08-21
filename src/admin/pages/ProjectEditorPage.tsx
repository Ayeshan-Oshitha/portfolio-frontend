import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import Checkbox from "@/admin/components/ui/Checkbox";
import Input from "@/admin/components/ui/Input";
import TagPicker from "@/admin/components/ui/TagPicker";
import Textarea from "@/admin/components/ui/Textarea";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/admin/hooks/useProjects";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import { slugify } from "@/admin/utils/format";
import type { AdminProject, ProjectWriteRequest } from "@/admin/types";
import {
  projectSchema,
  type ProjectFormValues,
} from "@/admin/validation/projectSchemas";

type TabId = "details" | "case-study" | "visibility";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "case-study", label: "Case study" },
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
  visibility: [
    "isPublished",
    "showOnAgency",
    "featuredOnAgency",
    "agencySortOrder",
    "showOnPersonal",
    "featuredOnPersonal",
    "personalSortOrder",
    "seoTitle",
    "seoDescription",
  ],
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
    agencySortOrder: 0,
    showOnPersonal: false,
    featuredOnPersonal: false,
    personalSortOrder: 0,
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
    agencySortOrder: project.agencySortOrder,
    showOnPersonal: project.showOnPersonal,
    featuredOnPersonal: project.featuredOnPersonal,
    personalSortOrder: project.personalSortOrder,
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

  // Keyed so landing on a different project remounts the form with its values
  // rather than leaving the previous defaults in place.
  return (
    <ProjectForm
      key={project?.id ?? "new"}
      project={project ?? null}
      onDone={() => navigate("/admin/projects")}
    />
  );
}

interface ProjectFormProps {
  /** `null` puts the form in create mode. */
  readonly project: AdminProject | null;
  readonly onDone: () => void;
}

function ProjectForm({ project, onDone }: ProjectFormProps) {
  const [tab, setTab] = useState<TabId>("details");
  const [formError, setFormError] = useState<string | null>(null);
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const isSaving =
    createProjectMutation.isPending || updateProjectMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
  });

  // "Featured" is meaningless without "show" on the same site, so each box is
  // disabled until its partner is on. The slug placeholder previews what the
  // API would generate from the title.
  const title = useWatch({ control, name: "title" });
  const showOnAgency = useWatch({ control, name: "showOnAgency" });
  const showOnPersonal = useWatch({ control, name: "showOnPersonal" });

  const tabsWithErrors = useMemo(() => {
    const flagged = new Set<TabId>();
    for (const { id } of TABS) {
      if (TAB_FIELDS[id].some((field) => errors[field])) flagged.add(id);
    }
    return flagged;
  }, [errors]);

  async function onSubmit(values: ProjectFormValues) {
    setFormError(null);

    // Built explicitly rather than spread: PUT replaces the whole record, so an
    // omitted boolean would land as false, an omitted number as 0 and an
    // omitted tagIds would wipe every tag.
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
      showOnAgency: values.showOnAgency,
      // A disabled checkbox keeps its last value, so the pairing is enforced
      // here too rather than trusting the field.
      featuredOnAgency: values.showOnAgency && values.featuredOnAgency,
      agencySortOrder: values.agencySortOrder,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.showOnPersonal && values.featuredOnPersonal,
      personalSortOrder: values.personalSortOrder,
      tagIds: values.tagIds,
    };

    try {
      if (project) {
        await updateProjectMutation.mutateAsync({ id: project.id, body });
      } else {
        await createProjectMutation.mutateAsync(body);
      }
      onDone();
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setTab("details");
        setError("slug", { type: "server", message: error.message });
        return;
      }
      setFormError(toErrorMessage(error));
    }
  }

  const slugPreview = slugify(title ?? "");

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 mb-6 text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          {project ? "Edit project" : "New project"}
        </h1>
        <p className="text-sm text-text-muted">
          {project
            ? "Every field is sent on save — the API replaces the whole project."
            : "Long-form case study copy. Markdown is fine in the description fields."}
        </p>
      </div>

      {/* One form across all three tabs: the panels are only hidden, never
          unmounted, so an error on a tab you are not looking at still blocks
          submit and still shows up as a dot on its tab. */}
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

        <Card className={tab === "details" ? "space-y-5" : "hidden"}>
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

          <Textarea
            label="Description (markdown)"
            required
            rows={10}
            error={errors.description?.message}
            {...register("description")}
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
        </Card>

        <Card className={tab === "case-study" ? "space-y-5" : "hidden"}>
          <p className="text-sm text-text-muted">
            All four are optional and rendered as markdown on the public case
            study page.
          </p>

          <Textarea
            label="Problem"
            rows={5}
            error={errors.problem?.message}
            {...register("problem")}
          />

          <Textarea
            label="Solution"
            rows={5}
            error={errors.solution?.message}
            {...register("solution")}
          />

          <Textarea
            label="What we delivered"
            rows={5}
            error={errors.whatWeDelivered?.message}
            {...register("whatWeDelivered")}
          />

          <Textarea
            label="Proof"
            rows={5}
            error={errors.proof?.message}
            {...register("proof")}
          />
        </Card>

        <Card className={tab === "visibility" ? "space-y-5" : "hidden"}>
          <Checkbox
            label="Published"
            hint="Drafts stay off both public sites regardless of the visibility flags below."
            {...register("isPublished")}
          />

          <fieldset className="rounded-lg border border-border-subtle p-4 space-y-4">
            <legend className="px-2 text-[10px] font-semibold tracking-widest uppercase text-text-muted">
              Agency site
            </legend>

            <Checkbox label="Show on agency" {...register("showOnAgency")} />

            <Checkbox
              label="Featured on agency"
              disabled={!showOnAgency}
              error={errors.featuredOnAgency?.message}
              {...register("featuredOnAgency")}
            />

            <Input
              label="Sort order"
              type="number"
              step={1}
              containerClassName="w-32"
              error={errors.agencySortOrder?.message}
              {...register("agencySortOrder", { valueAsNumber: true })}
            />
          </fieldset>

          <fieldset className="rounded-lg border border-border-subtle p-4 space-y-4">
            <legend className="px-2 text-[10px] font-semibold tracking-widest uppercase text-text-muted">
              Personal site
            </legend>

            <Checkbox
              label="Show on personal"
              {...register("showOnPersonal")}
            />

            <Checkbox
              label="Featured on personal"
              disabled={!showOnPersonal}
              error={errors.featuredOnPersonal?.message}
              {...register("featuredOnPersonal")}
            />

            <Input
              label="Sort order"
              type="number"
              step={1}
              containerClassName="w-32"
              error={errors.personalSortOrder?.message}
              {...register("personalSortOrder", { valueAsNumber: true })}
            />
          </fieldset>

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
        </Card>

        <div className="sticky bottom-0 mt-6 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-surface-950/90 backdrop-blur border-t border-border-subtle">
          {/* Raised here rather than inside a panel so an error is visible
              whichever tab is open. */}
          {formError && <Alert className="mb-4">{formError}</Alert>}

          {tabsWithErrors.size > 0 && (
            <p className="mb-4 text-xs text-danger-400">
              Some fields need attention — the dotted tabs above have errors.
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
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
