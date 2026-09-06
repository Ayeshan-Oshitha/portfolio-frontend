import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import { useCreateFaq, useUpdateFaq } from "@/admin/hooks/useFaqs";
import { useServices } from "@/admin/hooks/useServices";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminFaq, FaqWriteRequest } from "@/admin/types";
import { faqSchema, type FaqFormValues } from "@/admin/validation/faqSchemas";
import { Button, Checkbox, Modal, Select, Textarea } from "@/admin/components/ui";

/** Well above any realistic service count — this picker isn't paged. */
const SERVICE_PAGE_SIZE = 100;

interface FaqFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly faq: AdminFaq | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: FaqFormValues = {
  serviceId: "",
  question: "",
  answer: "",
  isPublished: false,
  showOnAgency: true,
  showOnPersonal: false,
};

function toFormValues(faq: AdminFaq | null): FaqFormValues {
  if (!faq) return BLANK_VALUES;

  return {
    serviceId: faq.serviceId ?? "",
    question: faq.question,
    answer: faq.answer,
    isPublished: faq.isPublished,
    showOnAgency: faq.showOnAgency,
    showOnPersonal: faq.showOnPersonal,
  };
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

  const { data: servicesResult } = useServices({ pageSize: SERVICE_PAGE_SIZE });
  const scopeOptions = [
    { value: "", label: "Global (both sites' shared list)" },
    ...(servicesResult?.items ?? []).map((service) => ({
      value: service.id,
      label: service.name,
    })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<FaqFormValues>(`faq-form:${faq?.id ?? "new"}`, {
    resolver: zodResolver(faqSchema),
    defaultValues: toFormValues(faq),
  });

  async function onSubmit(values: FaqFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field resets to default.
    const body: FaqWriteRequest = {
      serviceId: values.serviceId ? values.serviceId : undefined,
      question: values.question.trim(),
      answer: values.answer.trim(),
      isPublished: values.isPublished,
      showOnAgency: values.showOnAgency,
      showOnPersonal: values.showOnPersonal,
    };

    try {
      if (faq) {
        await updateFaqMutation.mutateAsync({ id: faq.id, body });
        toast.success("FAQ updated.");
      } else {
        await createFaqMutation.mutateAsync(body);
        toast.success("FAQ created.");
      }
      clearPersisted();
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
        <div>
          <Select
            label="Scope"
            options={scopeOptions}
            {...register("serviceId")}
          />
          <p className="mt-2 text-xs text-text-muted">
            A service&rsquo;s own FAQs render only on that service&rsquo;s page, not the shared list.
          </p>
        </div>

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

        <div className="pt-4 border-t border-border-subtle">
          <Checkbox
            label="Published"
            hint="Drafts stay out of the public FAQ endpoints."
            {...register("isPublished")}
          />
        </div>

        <div className="pt-4 border-t border-border-subtle space-y-4">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Site
          </span>

          <div className="flex items-center gap-6">
            <Checkbox label="Show on agency" {...register("showOnAgency")} />
            <Checkbox
              label="Show on personal"
              {...register("showOnPersonal")}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(faq));
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
              : faq
                ? "Save changes"
                : "Create FAQ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
