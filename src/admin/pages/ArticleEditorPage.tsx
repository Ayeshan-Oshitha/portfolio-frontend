import { useRef } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import ArticleCoverPicker from "@/admin/components/articles/ArticleCoverPicker";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useArticle,
  useCreateArticle,
  useUpdateArticle,
} from "@/admin/hooks/useArticles";
import { useMediaConfig } from "@/admin/hooks/useMedia";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import { resolveMediaDisplayUrl } from "@/admin/utils/markdownImages";
import type { AdminArticle, ArticleWriteRequest } from "@/admin/types";
import {
  articleSchema,
  type ArticleFormValues,
} from "@/admin/validation/articleSchemas";
import {
  Alert,
  BackLink,
  Button,
  Checkbox,
  Input,
  PageHeader,
  Spinner,
  TagPicker,
  Textarea,
} from "@/admin/components/ui";

/** Built fresh per mount so a new article defaults to today, not to load time. */
function blankValues(): ArticleFormValues {
  return {
    title: "",
    excerpt: "",
    slug: "",
    coverImageKey: "",
    contentMarkdown: "",
    isPublished: false,
    showOnAgency: false,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
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
    coverImageKey: article.coverImageKey ?? "",
    contentMarkdown: article.contentMarkdown ?? "",
    isPublished: article.isPublished,
    showOnAgency: article.showOnAgency,
    featuredOnAgency: article.featuredOnAgency,
    showOnPersonal: article.showOnPersonal,
    featuredOnPersonal: article.featuredOnPersonal,
    tagIds: article.tags.map((tag) => tag.id),
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Serves both `/admin/articles/new` and `/admin/articles/:id`. Moved off the
 * modal onto its own route so the markdown editor and tag picker have room to
 * breathe, matching the pattern `ProjectEditorPage` already established.
 */
export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: article,
    isPending: isLoading,
    error: queryError,
  } = useArticle(id);
  const loadError = queryError ? toErrorMessage(queryError) : null;

  if (id && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-primary-400">
        <Spinner className="h-6 w-6" label="Loading article" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-[1600px]">
        <Alert className="mb-6">{loadError}</Alert>
        <Button href="/admin/articles" variant="outline" size="sm">
          Back to articles
        </Button>
      </div>
    );
  }

  // Keyed so navigating to a different article remounts the form instead of reusing stale defaults.
  return (
    <ArticleForm
      key={article?.id ?? "new"}
      article={article ?? null}
      onDone={() => navigate("/admin/articles")}
    />
  );
}

interface ArticleFormProps {
  /** `null` puts the form in create mode. */
  readonly article: AdminArticle | null;
  readonly onDone: () => void;
}

function ArticleForm({ article, onDone }: ArticleFormProps) {
  const toast = useToast();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const isSaving =
    createArticleMutation.isPending || updateArticleMutation.isPending;

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
  } = usePersistedForm<ArticleFormValues>(
    `article-form:${article?.id ?? "new"}`,
    {
      resolver: zodResolver(articleSchema),
      defaultValues: toFormValues(article),
    },
  );

  const title = useWatch({ control, name: "title" });
  const contentMarkdown = useWatch({ control, name: "contentMarkdown" });
  const coverImageKey = useWatch({ control, name: "coverImageKey" });
  const slugValue = useWatch({ control, name: "slug" });
  const editorRef = useRef<HTMLDivElement>(null);
  const { data: mediaConfig } = useMediaConfig();

  /** Uploads land under the article's folder, so they need its slug up front. */
  const uploadSlug = slugify(slugValue?.trim() || title?.trim() || "");

  /**
   * Drops the image where the caret is rather than at the end, so an upload can
   * land mid-article. MDEditor owns its textarea, hence reaching for it through
   * the wrapper instead of holding a ref to it directly; with no caret to read
   * (the editor was never focused) appending is the sane fallback.
   */
  function insertIntoContent(snippet: string) {
    const current = getValues("contentMarkdown") ?? "";
    const textarea = editorRef.current?.querySelector<HTMLTextAreaElement>(
      ".w-md-editor-text-input",
    );
    const caret = textarea?.selectionStart ?? current.length;

    const before = current.slice(0, caret);
    const after = current.slice(caret);
    const lead = before && !before.endsWith("\n") ? "\n\n" : "";
    const trail = after.startsWith("\n") ? "\n" : "\n\n";

    setValue("contentMarkdown", `${before}${lead}${snippet}${trail}${after}`, {
      shouldDirty: true,
    });
  }

  function selectCover(url: string) {
    setValue("coverImageKey", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: ArticleFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field would wipe out.
    const body: ArticleWriteRequest = {
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      slug: blank(values.slug),
      // Required by the schema, and always a full url the picker took from the body.
      coverImageKey: values.coverImageKey.trim(),
      contentMarkdown: blank(values.contentMarkdown),
      isPublished: values.isPublished,
      // Show/feature per site are set from the reorder screen, not this form —
      // carried through untouched so saving other fields doesn't reset them.
      showOnAgency: values.showOnAgency,
      featuredOnAgency: values.featuredOnAgency,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.featuredOnPersonal,
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
      onDone();
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
    <div className="max-w-[1600px]">
      <BackLink to="/admin/articles">Articles</BackLink>

      <PageHeader
        title={article ? "Edit article" : "New article"}
        description="Every field is sent on save — the API replaces the whole article."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
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

          {/* Registered so the resolver sees it; the value is only ever set by the picker below. */}
          <input type="hidden" {...register("coverImageKey")} />

          <Controller
            control={control}
            name="contentMarkdown"
            render={({ field }) => (
              <div
                ref={editorRef}
                className="admin-markdown"
                data-color-mode="light"
              >
                <label className="block mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  Content
                </label>
                <MDEditor
                  value={field.value ?? ""}
                  onChange={(value) => field.onChange(value ?? "")}
                  height={600}
                  preview="live"
                  visibleDragbar={false}
                  previewOptions={{
                    // The stored markdown holds `media://` tokens, not loadable
                    // urls — the live preview pane needs each <img> src resolved
                    // the same way the cover picker's thumbnails are.
                    rehypeRewrite: (node) => {
                      if (
                        node.type === "element" &&
                        node.tagName === "img" &&
                        typeof node.properties?.src === "string"
                      ) {
                        const resolved = resolveMediaDisplayUrl(
                          node.properties.src,
                          mediaConfig?.publicBaseUrl,
                        );
                        if (resolved) node.properties.src = resolved;
                      }
                    },
                  }}
                />
                {errors.contentMarkdown?.message && (
                  <p className="mt-2 text-xs text-danger-400">
                    {errors.contentMarkdown.message}
                  </p>
                )}
              </div>
            )}
          />

          <ArticleCoverPicker
            markdown={contentMarkdown ?? ""}
            coverUrl={coverImageKey ?? ""}
            slug={uploadSlug}
            onInsert={insertIntoContent}
            onSelectCover={selectCover}
            error={errors.coverImageKey?.message}
          />

          <Checkbox
            label="Published"
            hint="Drafts stay off both public sites. Once published, use Reorder & Visibility to show it on a site."
            {...register("isPublished")}
          />

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
        </div>

        <div className="sticky bottom-0 mt-6 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-surface-950/90 backdrop-blur border-t border-border-subtle">
          <div className="flex items-center justify-end gap-3">
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
              onClick={onDone}
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
        </div>
      </form>
    </div>
  );
}
