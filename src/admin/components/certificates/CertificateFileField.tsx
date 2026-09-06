import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import {
  createPresignedUpload,
  uploadToPresignedUrl,
} from "@/admin/services/mediaService";
import { altTextFromFileName } from "@/admin/utils/markdownImages";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { Button, Input } from "@/admin/components/ui";

export interface CertificateFileValue {
  readonly objectKey: string;
  readonly url: string;
  readonly mimeType: string;
  /** Absent for a PDF, which has no pixel dimensions. */
  readonly width?: number;
  readonly height?: number;
  readonly altText: string;
}

interface CertificateFileFieldProps {
  readonly value: CertificateFileValue | null;
  readonly onChange: (value: CertificateFileValue | null) => void;
  readonly disabled?: boolean;
}

/** Reads pixel dimensions from the file itself — only meaningful for an image. */
function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions."));
    };
    image.src = objectUrl;
  });
}

/**
 * The certificate's one file — a PDF or an image — uploaded straight to Neon
 * Object Storage via the same presigned-upload contract as every other
 * uploaded asset. Unlike a project's image gallery there's only ever one:
 * uploading again just replaces it.
 */
export default function CertificateFileField({
  value,
  onChange,
  disabled = false,
}: CertificateFileFieldProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function handleFileChosen(file: File) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const isImage = file.type.startsWith("image/");
      const [presigned, dimensions] = await Promise.all([
        createPresignedUpload({ target: "certificates" }),
        isImage ? readImageDimensions(file) : Promise.resolve(null),
      ]);
      await uploadToPresignedUrl(presigned.uploadUrl, file, setUploadProgress);

      onChange({
        objectKey: presigned.objectKey,
        url: presigned.publicUrl,
        mimeType: file.type,
        width: dimensions?.width,
        height: dimensions?.height,
        altText: altTextFromFileName(file.name),
      });
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isImage = value?.mimeType.startsWith("image/") ?? false;

  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
        Certificate file
      </span>

      {value ? (
        <div className="flex items-start gap-4 rounded-lg border border-border-subtle p-3">
          {isImage ? (
            <img
              src={value.url}
              alt={value.altText}
              className="h-16 w-16 rounded-md object-cover shrink-0"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-surface-800">
              <FileText className="h-6 w-6 text-text-muted" />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-2">
            <Input
              label="Alt text"
              required
              value={value.altText}
              onChange={(event) =>
                onChange({ ...value, altText: event.target.value })
              }
              disabled={disabled}
            />
            <p className="text-xs text-text-muted">
              {value.mimeType}
              {value.width && value.height
                ? ` · ${value.width}×${value.height}`
                : ""}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onChange(null)}
            disabled={disabled}
            icon={<Trash2 className="h-3.5 w-3.5" />}
            iconPosition="left"
          >
            Remove
          </Button>
        </div>
      ) : (
        <div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={isUploading}
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="h-4 w-4" />}
            iconPosition="left"
          >
            {isUploading ? `Uploading… ${uploadProgress}%` : "Upload file"}
          </Button>
          <p className="mt-1.5 text-xs text-text-muted">PDF or image.</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFileChosen(file);
        }}
      />

      {!value && (
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <Upload className="h-3 w-3" aria-hidden="true" />
          Uploads straight to Neon Object Storage.
        </p>
      )}
    </div>
  );
}
