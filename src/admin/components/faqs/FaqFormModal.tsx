import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/portfolio/components/ui/Button";
import Checkbox from "@/admin/components/ui/Checkbox";
import Input from "@/admin/components/ui/Input";
import Modal from "@/admin/components/ui/Modal";
import Textarea from "@/admin/components/ui/Textarea";
import { useCreateFaq, useUpdateFaq } from "@/admin/hooks/useFaqs";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminFaq, FaqWriteRequest } from "@/admin/types";
import { faqSchema, type FaqFormValues } from "@/admin/validation/faqSchemas";

interface FaqFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly faq: AdminFaq | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: FaqFormValues = {
  question: "",
  answer: "",
  category: "",
  sortOrder: 0,
  isPublished: false,
  showOnAgency: true,
  featuredOnAgency: false,
  agencySortOrder: 0,
  showOnPersonal: false,
  featuredOnPersonal: false,
  personalSortOrder: 0,
};

function toFormValues(faq: AdminFaq | null): FaqFormValues {
  if (!faq) return BLANK_VALUES;

  return {
    question: faq.question,
    answer: faq.answer,
    category: faq.category ?? "",
    sortOrder: faq.sortOrder,
    isPublished: faq.isPublished,
    showOnAgency: faq.showOnAgency,
    featuredOnAgency: faq.featuredOnAgency,
    agencySortOrder: faq.agencySortOrder,
    showOnPersonal: faq.showOnPersonal,
    featuredOnPersonal: faq.featuredOnPersonal,
    personalSortOrder: faq.personalSortOrder,
  };
}

/** `""` is how an untouched optional field reaches us; the API wants it gone. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Mounted only while the dialog is open, and keyed on the FAQ by `FaqsPage`,
 * so the form state starts fresh for every row instead of being reset.
 */
export default function FaqFormModal({
  faq,
  onClose,
  onSaved,
}: FaqFormModalProps) {
  const toast = useToast();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const isSaving = createFaqMutation.isPending || updateFaqMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: toFormValues(faq),
  });

  const showOnAgency = useWatch({ control, name: "showOnAgency" });
  const showOnPersonal = useWatch({ control, name: "showOnPersonal" });

  async function onSubmit(values: FaqFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field resets to default.
    const body: FaqWriteRequest = {
      question: values.question.trim(),
      answer: values.answer.trim(),
      category: blank(values.category),
      sortOrder: values.sortOrder,
      isPublished: values.isPublished,
      showOnAgency: values.showOnAgency,
      featuredOnAgency: values.featuredOnAgency,
      agencySortOrder: values.agencySortOrder,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.featuredOnPersonal,
      personalSortOrder: values.personalSortOrder,
    };

    try {
      if (faq) {
        await updateFaqMutation.mutateAsync({ id: faq.id, body });
        toast.success("FAQ updated.");
      } else {
        await createFaqMutation.mutateAsync(body);
        toast.success("FAQ created.");
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={faq ? "Edit FAQ" : "New FAQ"}
      description={
        faq
          ? "Every field is sent on save — the API replaces the whole FAQ."
          : "FAQs appear on both sites, filtered by visibility below."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Textarea
          label="Question"
          required
          autoFocus
          rows={2}
          error={errors.question?.message}
          {...register("question")}
        />

        <Textarea
          label="Answer"
          required
          rows={8}
          placeholder="Markdown"
          error={errors.answer?.message}
          {...register("answer")}
        />

        <div className="flex gap-4">
          <Input
            label="Category"
            containerClassName="flex-1"
            error={errors.category?.message}
            {...register("category")}
          />

          <Input
            label="Sort order"
            type="number"
            step={1}
            containerClassName="w-32"
            error={errors.sortOrder?.message}
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>

        <div className="pt-4 border-t border-border-subtle">
          <Checkbox
            label="Published"
            hint="Drafts stay out of the public FAQ endpoints."
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
            onClick={onClose}
            disabled={isSubmitting || isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting || isSaving}>
            {isSubmitting || isSaving
              ? "Saving…"
              : faq
                ? "Save changes"
                : "Create FAQ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
