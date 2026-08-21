import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/admin/components/ui/Button";
import Checkbox from "@/admin/components/ui/Checkbox";
import Input from "@/admin/components/ui/Input";
import Modal from "@/admin/components/ui/Modal";
import TagPicker from "@/admin/components/ui/TagPicker";
import Textarea from "@/admin/components/ui/Textarea";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import { useCreateArticle, useUpdateArticle } from "@/admin/hooks/useArticles";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify, todayDateOnly } from "@/admin/utils/format";
import type { AdminArticle, ArticleWriteRequest } from "@/admin/types";
import {
  articleSchema,
  type ArticleFormValues,
} from "@/admin/validation/articleSchemas";

interface ArticleFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly article: AdminArticle | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

/** Built fresh per mount so a new article defaults to today, not to load time. */
function blankValues(): ArticleFormValues {
  return {
    title: "",
    excerpt: "",
    slug: "",
    publishedDate: todayDateOnly(),
    mediumUrl: "",
    coverImageId: "",
    isPublished: false,
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
 * relation is flattened on the way into the form.
 */
function toFormValues(article: AdminArticle | null): ArticleFormValues {
  if (!article) return blankValues();

  return {
    title: article.title,
    excerpt: article.excerpt,
    slug: article.slug ?? "",
    publishedDate: article.publishedDate,
    mediumUrl: article.mediumUrl,
    coverImageId: article.coverImageId ?? "",
    isPublished: article.isPublished,
    showOnAgency: article.showOnAgency,
    featuredOnAgency: article.featuredOnAgency,
    agencySortOrder: article.agencySortOrder,
    showOnPersonal: article.showOnPersonal,
    featuredOnPersonal: article.featuredOnPersonal,
    personalSortOrder: article.personalSortOrder,
    tagIds: article.tags.map((tag) => tag.id),
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Mounted only while the dialog is open, and keyed on the article by
 * `ArticlesPage`, so the form state starts fresh for every row.
 */
export default function ArticleFormModal({
  article,
  onClose,
  onSaved,
}: ArticleFormModalProps) {
  const toast = useToast();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const isSaving =
    createArticleMutation.isPending || updateArticleMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<ArticleFormValues>(
    `article-form:${article?.id ?? "new"}`,
    {
      resolver: zodResolver(articleSchema),
      defaultValues: toFormValues(article),
    },
  );

  // "Featured" requires "show" on the same site, so each checkbox is disabled until its partner is on.
  const title = useWatch({ control, name: "title" });
  const showOnAgency = useWatch({ control, name: "showOnAgency" });
  const showOnPersonal = useWatch({ control, name: "showOnPersonal" });

  async function onSubmit(values: ArticleFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field would wipe out.
    const body: ArticleWriteRequest = {
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      slug: blank(values.slug),
      publishedDate: values.publishedDate,
      mediumUrl: values.mediumUrl.trim(),
      coverImageId: blank(values.coverImageId),
      isPublished: values.isPublished,
      showOnAgency: values.showOnAgency,
      // Re-enforced here since a disabled checkbox keeps its last submitted value.
      featuredOnAgency: values.showOnAgency && values.featuredOnAgency,
      agencySortOrder: values.agencySortOrder,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.showOnPersonal && values.featuredOnPersonal,
      personalSortOrder: values.personalSortOrder,
      tagIds: values.tagIds,
    };

    try {
      if (article) {
        await updateArticleMutation.mutateAsync({ id: article.id, body });
        toast.success("Article updated.");
      } else {
        await createArticleMutation.mutateAsync(body);
        toast.success("Article created.");
      }
      clearPersisted();
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setError("slug", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  const slugPreview = slugify(title ?? "");

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={article ? "Edit article" : "New article"}
      description={
        article
          ? "Every field is sent on save — the API replaces the whole article."
          : "Articles link out to Medium, so there is no body to write here."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Title"
          required
          autoFocus
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          label="Excerpt"
          required
          rows={3}
          error={errors.excerpt?.message}
          {...register("excerpt")}
        />

        <Input
          label="Slug"
          placeholder={slugPreview || "generated-from-the-title"}
          error={errors.slug?.message}
          {...register("slug")}
        />

        <div className="flex gap-4">
          <Input
            label="Published date"
            type="date"
            required
            containerClassName="w-48"
            error={errors.publishedDate?.message}
            {...register("publishedDate")}
          />

          <Input
            label="Medium URL"
            required
            placeholder="https://medium.com/@you/a-post"
            containerClassName="flex-1"
            error={errors.mediumUrl?.message}
            {...register("mediumUrl")}
          />
        </div>

        <Input
          label="Cover image id"
          placeholder="portfolio/articles/my-post"
          error={errors.coverImageId?.message}
          {...register("coverImageId")}
        />

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

          <Checkbox label="Show on personal" {...register("showOnPersonal")} />

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

        <Controller
          control={control}
          name="tagIds"
          render={({ field, fieldState }) => (
            <TagPicker
              label="Tags"
              value={field.value}
              onChange={field.onChange}
              hint="Saved as a complete set — removing a chip drops the tag on save."
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(article));
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
              : article
                ? "Save changes"
                : "Create article"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
