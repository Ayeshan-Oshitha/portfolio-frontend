import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useAddProjectImage,
  useDeleteProjectImage,
  useReorderProjectImages,
  useUpdateProjectImage,
} from "@/admin/hooks/useProjects";
import {
  createPresignedUpload,
  uploadToPresignedUrl,
} from "@/admin/services/mediaService";
import { toErrorMessage } from "@/admin/api/ApiError";
import { altTextFromFileName } from "@/admin/utils/markdownImages";
import { projectKeys } from "@/admin/hooks/queryKeys";
import useToast from "@/admin/context/useToast";
import type { AdminProject, ProjectImage } from "@/admin/types";
import { Button, Input, Modal } from "@/admin/components/ui";
import SortableProjectImageRow from "@/admin/components/projects/SortableProjectImageRow";

interface ProjectImagesEditorProps {
  readonly projectId: string;
  readonly projectSlug: string;
  readonly images: readonly ProjectImage[];
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
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Both the outgoing and incoming primary flip in the same request — freeze both rows while it's in flight.
  const [primaryUpdateIds, setPrimaryUpdateIds] = useState<readonly string[]>([]);
  const [editingAltText, setEditingAltText] = useState<ProjectImage | null>(null);
  const [altTextDraft, setAltTextDraft] = useState("");

  const addImageMutation = useAddProjectImage();
  const updateImageMutation = useUpdateProjectImage();
  const deleteImageMutation = useDeleteProjectImage();
  const reorderImagesMutation = useReorderProjectImages();

  // Mirrored into local state (rather than read straight from `images` every
  // render) so a drop can reorder the list synchronously, in the same commit
  // as dnd-kit's own internal reset of the dragged item's transform. Waiting
  // on the query cache to propagate through React Query's external-store
  // subscription lands the reorder one render late, which is what caused the
  // dropped card to flash back to its old slot before snapping to the new one.
  const [rows, setRows] = useState(() =>
    [...images].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  useEffect(() => {
    setRows([...images].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [images]);

  const primary = rows.find((image) => image.isPrimary) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  async function handleFileChosen(file: File) {
    const altText = altTextFromFileName(file.name);
    if (!altText) {
      toast.error("An image needs alt text before it can be uploaded.");
      return;
    }
    if (rows.some((row) => row.altText.toLowerCase() === altText.toLowerCase())) {
      toast.error(`An image named "${altText}" is already in this gallery.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const [presigned, dimensions] = await Promise.all([
        createPresignedUpload({ target: "projects", slug: projectSlug }),
        readImageDimensions(file),
      ]);
      await uploadToPresignedUrl(presigned.uploadUrl, file, setUploadProgress);

      await addImageMutation.mutateAsync({
        projectId,
        body: {
          objectKey: presigned.objectKey,
          url: presigned.publicUrl,
          altText,
          width: dimensions.width,
          height: dimensions.height,
          isPrimary: rows.length === 0,
          sortOrder: rows.length,
        },
      });
      toast.success("Image uploaded.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function openAltTextEditor(image: ProjectImage) {
    setEditingAltText(image);
    setAltTextDraft(image.altText);
  }

  async function saveAltText() {
    if (!editingAltText) return;
    const next = altTextDraft.trim();
    if (!next || next === editingAltText.altText) {
      setEditingAltText(null);
      return;
    }

    setBusyId(editingAltText.id);
    try {
      await updateImageMutation.mutateAsync({
        projectId,
        imageId: editingAltText.id,
        body: {
          objectKey: editingAltText.objectKey,
          url: editingAltText.url,
          altText: next,
          width: editingAltText.width,
          height: editingAltText.height,
          isPrimary: editingAltText.isPrimary,
          sortOrder: editingAltText.sortOrder,
        },
      });
      toast.success("Alt text updated.");
      setEditingAltText(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  async function handleMakePrimary(image: ProjectImage) {
    if (image.isPrimary) return;

    const outgoingId = primary?.id;
    setPrimaryUpdateIds(outgoingId ? [outgoingId, image.id] : [image.id]);
    const loadingToastId = toast.loading("Updating primary image…");
    try {
      await updateImageMutation.mutateAsync({
        projectId,
        imageId: image.id,
        body: {
          objectKey: image.objectKey,
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
      toast.dismiss(loadingToastId);
      setPrimaryUpdateIds([]);
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

  /**
   * Primary is just a flag on whichever image the user picked — it has no
   * bearing on drag order, so this is a plain reorder of the whole list.
   * `setRows` runs first and synchronously (same event, same commit as
   * dnd-kit's own drop cleanup) so there's no in-between frame where the
   * dragged card renders back at its pre-drag DOM position. The query cache
   * write follows so the order survives a remount/refetch, with a rollback —
   * to both the local list and the cache — on failure.
   */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((image) => image.id === active.id);
    const toIndex = rows.findIndex((image) => image.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const previousRows = rows;
    const reordered = arrayMove([...rows], fromIndex, toIndex).map(
      (image, at) => ({ ...image, sortOrder: at }),
    );
    setRows(reordered);

    const queryKey = projectKeys.detail(projectId);
    const previousCache = queryClient.getQueryData<AdminProject>(queryKey);
    queryClient.setQueryData<AdminProject | undefined>(queryKey, (old) =>
      old && { ...old, images: reordered },
    );

    try {
      await reorderImagesMutation.mutateAsync({
        projectId,
        body: {
          items: reordered.map((image) => ({ id: image.id, sortOrder: image.sortOrder })),
        },
      });
      toast.success("Order updated.");
    } catch (cause) {
      setRows(previousRows);
      queryClient.setQueryData(queryKey, previousCache);
      toast.error(toErrorMessage(cause));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={isUploading}
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload className="h-4 w-4" />}
          iconPosition="left"
        >
          {isUploading ? "Uploading…" : "Upload image"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFileChosen(file);
          }}
        />

        {isUploading && (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-800">
            <div
              className="h-full rounded-full bg-primary-500 transition-[width] duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">No images yet.</p>
      ) : (
        <ul className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows.map((image) => image.id)}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((image) => (
                <SortableProjectImageRow
                  key={image.id}
                  image={image}
                  busy={busyId === image.id || primaryUpdateIds.includes(image.id)}
                  onEditAltText={openAltTextEditor}
                  onMakePrimary={handleMakePrimary}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      )}

      <p className="flex items-center gap-2 text-xs text-text-muted">
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Images upload straight to Neon Object Storage; the API only stores
        their metadata.
      </p>

      <Modal
        open={editingAltText !== null}
        onClose={() => setEditingAltText(null)}
        title="Edit alt text"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingAltText(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={saveAltText}
              loading={busyId === editingAltText?.id && updateImageMutation.isPending}
              disabled={
                !altTextDraft.trim() || altTextDraft.trim() === editingAltText?.altText
              }
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          label="Alt text"
          value={altTextDraft}
          onChange={(event) => setAltTextDraft(event.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
}
