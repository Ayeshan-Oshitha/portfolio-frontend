import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateCertificate,
  useUpdateCertificate,
} from "@/admin/hooks/useCertificates";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminCertificate, CertificateWriteRequest } from "@/admin/types";
import {
  certificateSchema,
  type CertificateFormValues,
} from "@/admin/validation/certificateSchemas";
import CertificateFileField, {
  type CertificateFileValue,
} from "@/admin/components/certificates/CertificateFileField";
import { Button, Checkbox, Input, Modal } from "@/admin/components/ui";

interface CertificateFormModalProps {
  /** `null` opens the dialog in create mode. */
  readonly certificate: AdminCertificate | null;
  readonly onClose: () => void;
  readonly onSaved: () => void;
}

const BLANK_VALUES: CertificateFormValues = {
  name: "",
  issuedBy: "",
  issuedDate: "",
  marks: "",
  objectKey: "",
  url: "",
  mimeType: "",
  width: undefined,
  height: undefined,
  altText: "",
  isPublished: false,
  featured: false,
};

function toFormValues(certificate: AdminCertificate | null): CertificateFormValues {
  if (!certificate) return BLANK_VALUES;

  return {
    name: certificate.name,
    issuedBy: certificate.issuedBy,
    issuedDate: certificate.issuedDate,
    marks: certificate.marks ?? "",
    objectKey: certificate.objectKey,
    url: certificate.url,
    mimeType: certificate.mimeType,
    width: certificate.width,
    height: certificate.height,
    altText: certificate.altText,
    isPublished: certificate.isPublished,
    featured: certificate.featured,
  };
}

function toFileValue(
  objectKey?: string,
  url?: string,
  mimeType?: string,
  width?: number,
  height?: number,
  altText?: string,
): CertificateFileValue | null {
  return objectKey && url
    ? { objectKey, url, mimeType: mimeType ?? "", width, height, altText: altText ?? "" }
    : null;
}

/**
 * Mounted only while the dialog is open, and keyed on the certificate by
 * `CertificatesPage`, so the form state starts fresh for every row instead
 * of being reset.
 */
export default function CertificateFormModal({
  certificate,
  onClose,
  onSaved,
}: CertificateFormModalProps) {
  const toast = useToast();
  const createCertificateMutation = useCreateCertificate();
  const updateCertificateMutation = useUpdateCertificate();
  const isSaving =
    createCertificateMutation.isPending || updateCertificateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<CertificateFormValues>(
    `certificate-form:${certificate?.id ?? "new"}`,
    {
      resolver: zodResolver(certificateSchema),
      defaultValues: toFormValues(certificate),
    },
  );

  const file = useWatch({
    control,
    name: ["objectKey", "url", "mimeType", "width", "height", "altText"],
  });

  function setFile(next: CertificateFileValue | null) {
    setValue("objectKey", next?.objectKey ?? "", { shouldDirty: true, shouldValidate: true });
    setValue("url", next?.url ?? "", { shouldDirty: true });
    setValue("mimeType", next?.mimeType ?? "", { shouldDirty: true });
    setValue("width", next?.width, { shouldDirty: true });
    setValue("height", next?.height, { shouldDirty: true });
    setValue("altText", next?.altText ?? "", { shouldDirty: true, shouldValidate: true });
  }

  async function onSubmit(values: CertificateFormValues) {
    // Built explicitly rather than spread: PUT replaces the whole record, so any omitted field resets to default.
    const body: CertificateWriteRequest = {
      name: values.name.trim(),
      issuedBy: values.issuedBy.trim(),
      issuedDate: values.issuedDate,
      marks: values.marks ? values.marks.trim() : undefined,
      objectKey: values.objectKey,
      url: values.url,
      mimeType: values.mimeType,
      width: values.width,
      height: values.height,
      altText: values.altText.trim(),
      isPublished: values.isPublished,
      featured: values.featured,
    };

    try {
      if (certificate) {
        await updateCertificateMutation.mutateAsync({ id: certificate.id, body });
        toast.success("Certificate updated.");
      } else {
        await createCertificateMutation.mutateAsync(body);
        toast.success("Certificate created.");
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
      title={certificate ? "Edit certificate" : "New certificate"}
      description={
        certificate
          ? "Every field is sent on save — the API replaces the whole certificate."
          : "Certificates only ever appear on the personal site."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <CertificateFileField value={toFileValue(...file)} onChange={setFile} />
          {errors.objectKey && (
            <p className="mt-1.5 text-xs text-danger-500">
              {errors.objectKey.message}
            </p>
          )}
        </div>

        <Input
          label="Name"
          required
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Issued by"
          required
          error={errors.issuedBy?.message}
          {...register("issuedBy")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Issue date"
            required
            error={errors.issuedDate?.message}
            {...register("issuedDate")}
          />
          <Input
            label="Marks"
            placeholder="e.g. 95%, Distinction"
            {...register("marks")}
          />
        </div>

        <div className="pt-4 border-t border-border-subtle space-y-4">
          <div className="flex items-center gap-6">
            <Checkbox label="Published" {...register("isPublished")} />
            <Checkbox label="Featured" {...register("featured")} />
          </div>
          <p className="text-xs text-text-muted">
            Drafts stay out of the public certificates endpoint. Featured
            certificates are the ones highlighted on the personal site.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset(toFormValues(certificate));
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
              : certificate
                ? "Save changes"
                : "Create certificate"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
