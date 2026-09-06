import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import {
  createPresignedUpload,
  uploadToPresignedUrl,
} from "@/admin/services/mediaService";
import { altTextFromFileName } from "@/admin/utils/markdownImages";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { Button, Input } from "@/admin/components/ui";

export interface ServiceImageValue {
  readonly objectKey: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly altText: string;
}

interface ServiceImageFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly value: ServiceImageValue | null;
  readonly onChange: (value: ServiceImageValue | null) => void;
  readonly disabled?: boolean;
}

/** Reads pixel dimensions from the file itself — the presigned upload response carries none. */
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
 * A single uploaded image — icon or hero — going straight to Neon Object
 * Storage, same presigned-upload contract as project images. Unlike the
 * gallery, there's only ever one: uploading again just replaces it.
 */
export default function ServiceImageField({
  label,
  hint,
  value,
  onChange,
  disabled = false,
}: ServiceImageFieldProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChosen(file: File) {
    setIsUploading(true);
    try {
      const [presigned, dimensions] = await Promise.all([
        createPresignedUpload({ target: "services" }),
        readImageDimensions(file),
      ]);
      await uploadToPresignedUrl(presigned.uploadUrl, file);

      onChange({
        objectKey: presigned.objectKey,
        url: presigned.publicUrl,
        width: dimensions.width,
        height: dimensions.height,
        altText: altTextFromFileName(file.name),
      });
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
        {label}
      </span>

      {value ? (
        <div className="flex items-start gap-4 rounded-lg border border-border-subtle p-3">
          <img
            src={value.url}
            alt={value.altText}
            className="h-16 w-16 rounded-md object-cover shrink-0"
          />

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
              {value.width}×{value.height}
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
            icon={<ImagePlus className="h-4 w-4" />}
            iconPosition="left"
          >
            {isUploading ? "Uploading…" : "Upload image"}
          </Button>
          {hint && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
