import { useRef, useState } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, Star, Trash2, Upload } from "lucide-react";
import Button from "@/portfolio/components/ui/Button";
import Spinner from "@/portfolio/components/ui/Spinner";
import Input from "@/admin/components/ui/Input";
import {
  useAddProjectImage,
  useDeleteProjectImage,
  useReorderProjectImages,
  useUpdateProjectImage,
} from "@/admin/hooks/useProjects";
import { createUploadSignature } from "@/admin/services/mediaService";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { ProjectImage } from "@/admin/types";

interface ProjectImagesEditorProps {
  readonly projectId: string;
  readonly projectSlug: string;
  readonly images: readonly ProjectImage[];
}

interface CloudinaryUploadResponse {
  readonly public_id: string;
  readonly secure_url: string;
  readonly width: number;
  readonly height: number;
}

/**
 * Images hang off a saved project via their own endpoints, so this operates
 * directly against the API rather than through the project form's Save
 * button — an upload can't be deferred into reviewable form state the way a
 * plain field can.
 */
export default function ProjectImagesEditor({
  projectId,
  projectSlug,
  images,
}: ProjectImagesEditorProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const addImageMutation = useAddProjectImage();
  const updateImageMutation = useUpdateProjectImage();
  const deleteImageMutation = useDeleteProjectImage();
  const reorderImagesMutation = useReorderProjectImages();

  const rows = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  async function handleFileChosen(file: File) {
    const altText = window.prompt(
      "Alt text for this image (required for accessibility)",
    );
    if (!altText || !altText.trim()) {
      toast.error("An image needs alt text before it can be uploaded.");
      return;
    }

    setIsUploading(true);
    try {
      const signature = await createUploadSignature({
        target: "projects",
        slug: projectSlug,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);
      if (signature.publicId) formData.append("public_id", signature.publicId);

      // Straight to Cloudinary, not through `httpClient` — the signature above authorizes it, not our bearer token.
      const { data: uploaded } = await axios.post<CloudinaryUploadResponse>(
        signature.uploadUrl,
        formData,
      );

      await addImageMutation.mutateAsync({
        projectId,
        body: {
          cloudinaryId: uploaded.public_id,
          url: uploaded.secure_url,
          altText: altText.trim(),
          width: uploaded.width,
          height: uploaded.height,
          isPrimary: rows.length === 0,
          sortOrder: rows.length,
        },
      });
      toast.success("Image uploaded.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleAltTextChange(image: ProjectImage) {
    const next = window.prompt("Alt text", image.altText);
    if (next === null || !next.trim() || next.trim() === image.altText) return;

    setBusyId(image.id);
    try {
      await updateImageMutation.mutateAsync({
        projectId,
        imageId: image.id,
        body: {
          cloudinaryId: image.cloudinaryId,
          url: image.url,
          altText: next.trim(),
          width: image.width,
          height: image.height,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder,
        },
      });
      toast.success("Alt text updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  async function handleMakePrimary(image: ProjectImage) {
    if (image.isPrimary) return;

    setBusyId(image.id);
    try {
      await updateImageMutation.mutateAsync({
        projectId,
        imageId: image.id,
        body: {
          cloudinaryId: image.cloudinaryId,
          url: image.url,
          altText: image.altText,
          width: image.width,
          height: image.height,
          isPrimary: true,
          sortOrder: image.sortOrder,
        },
      });
      toast.success("Primary image updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(image: ProjectImage) {
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) return;

    setBusyId(image.id);
    try {
      await deleteImageMutation.mutateAsync({ projectId, imageId: image.id });
      toast.success("Image deleted.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  /** Sends the whole gallery renumbered densely, same recipe as the list pages' reorder. */
  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await reorderImagesMutation.mutateAsync({
        projectId,
        body: {
          items: next.map((image, at) => ({ id: image.id, sortOrder: at })),
        },
      });
      toast.success("Order updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const isReordering = reorderImagesMutation.isPending;

  return (
    <div className="space-y-5">
      <div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          label="Upload image"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFileChosen(file);
          }}
        />
        {isUploading && (
          <p className="mt-2 flex items-center gap-2 text-xs text-text-muted">
            <Spinner className="h-3.5 w-3.5" label="Uploading" />
            Uploading…
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">No images yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((image, index) => (
            <li
              key={image.id}
              className="flex items-center gap-4 rounded-lg border border-border-subtle p-3"
            >
              <img
                src={image.url}
                alt={image.altText}
                className="h-16 w-16 rounded-md object-cover shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text-primary">
                  {image.altText}
                </p>
                <p className="text-xs text-text-muted">
                  {image.width}×{image.height}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={isReordering || index === 0}
                  aria-label="Move up"
                  title="Move up"
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={isReordering || index === rows.length - 1}
                  aria-label="Move down"
                  title="Move down"
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAltTextChange(image)}
                  loading={busyId === image.id && updateImageMutation.isPending}
                >
                  Alt text
                </Button>

                <Button
                  variant={image.isPrimary ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleMakePrimary(image)}
                  disabled={image.isPrimary}
                  icon={<Star className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {image.isPrimary ? "Primary" : "Make primary"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(image)}
                  loading={busyId === image.id && deleteImageMutation.isPending}
                  icon={<Trash2 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-center gap-2 text-xs text-text-muted">
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Images upload straight to Cloudinary; the API only stores their
        metadata.
      </p>
    </div>
  );
}
