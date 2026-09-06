import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateTag,
  useTechCategories,
  useUpdateTag,
} from "@/admin/hooks/useTags";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import { FIELD_BASE, FIELD_LABEL, FIELD_SIZE } from "@/admin/components/ui/fieldClasses";
import type { AdminTag, TagWriteRequest, TechCategory } from "@/admin/types";
import { tagSchema, type TagFormValues } from "@/admin/validation/tagSchemas";
import {
  Button,
  Checkbox,
  Input,
  LoadingDots,
  Modal,
  Select,
} from "@/admin/components/ui";

interface TagFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly tag: AdminTag | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: TagFormValues = {
  name: "",
  slug: "",
  isTechnology: false,
  technologyCategory: "",
};

function toFormValues(tag: AdminTag | null): TagFormValues {
  if (!tag) return BLANK_VALUES;

  return {
    name: tag.name,
    slug: tag.slug,
    isTechnology: tag.isTechnology,
    technologyCategory: tag.technologyCategory ?? "",
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Mounted only while the dialog is open, and keyed on the tag by `TagsPage`,
 * so the form state starts fresh for every row instead of being reset.
 */
export default function TagFormModal({
  tag,
  onClose,
  onSaved,
}: TagFormModalProps) {
  const toast = useToast();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const isSaving = createTagMutation.isPending || updateTagMutation.isPending;

  const { data: techCategories, isPending: isLoadingCategories } =
    useTechCategories();
  const categoryOptions = (techCategories ?? []).map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<TagFormValues>(`tag-form:${tag?.id ?? "new"}`, {
    resolver: zodResolver(tagSchema),
    defaultValues: toFormValues(tag),
  });

  // The technology fields only exist while this checkbox is on.
  const isTechnology = useWatch({ control, name: "isTechnology" });
  const name = useWatch({ control, name: "name" });

  async function onSubmit(values: TagFormValues) {
    // Built explicitly: the API rejects a category tag that still carries technology fields.
    const body: TagWriteRequest = {
      name: values.name.trim(),
      slug: blank(values.slug),
      isTechnology: values.isTechnology,
      technologyCategory: values.isTechnology
        ? (blank(values.technologyCategory) as TechCategory | undefined)
        : undefined,
    };

    try {
      if (tag) {
        await updateTagMutation.mutateAsync({ id: tag.id, body });
        toast.success("Tag updated.");
      } else {
        await createTagMutation.mutateAsync(body);
        toast.success("Tag created.");
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

  const slugPreview = slugify(name ?? "");

  return (
    <Modal
      open
      onClose={onClose}
      title={tag ? "Edit tag" : "New tag"}
      description={
        tag
          ? "Every field is sent on save — the API replaces the whole tag."
          : "Tags are shared by projects and articles."
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

        <Checkbox
          label="Technology"
          hint="Technology tags appear in the tech grid and need a category. Leave off for a project or article category."
          {...register("isTechnology")}
        />

        {isTechnology &&
          (isLoadingCategories ? (
            <div>
              <span className={FIELD_LABEL}>Tech Category</span>
              <div
                className={`${FIELD_BASE} ${FIELD_SIZE.md} flex items-center border-border-default text-text-muted`}
              >
                <LoadingDots label="Loading categories" />
              </div>
            </div>
          ) : (
            <Select
              label="Tech Category"
              required
              placeholder="Select a category"
              options={categoryOptions}
              error={errors.technologyCategory?.message}
              {...register("technologyCategory")}
            />
          ))}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(tag));
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
              : tag
                ? "Save changes"
                : "Create tag"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
