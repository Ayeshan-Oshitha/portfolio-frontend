import { useRef, useState } from "react";
import { ImagePlus, Star } from "lucide-react";
import { uploadImage } from "@/admin/services/mediaService";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import {
  altTextFromFileName,
  extractMarkdownImages,
  imageMarkdown,
} from "@/admin/utils/markdownImages";
import { Button, Spinner } from "@/admin/components/ui";

interface ArticleCoverPickerProps {
  /** The article body — the only source of selectable images. */
  readonly markdown: string;
  /** Currently chosen cover url, or `""` when none is set yet. */
  readonly coverUrl: string;
  /** Folder the upload lands in; the API rejects an articles upload without it. */
  readonly slug: string;
  readonly onInsert: (snippet: string) => void;
  readonly onSelectCover: (url: string) => void;
  readonly error?: string;
}

/**
 * Uploads go straight to storage and are appended to the body as markdown, so
 * every image an article carries is visible in its content. The cover is then
 * chosen from exactly those images rather than uploaded separately — that
 * pairing is what keeps the stored cover url pointing at something the article
 * actually shows.
 */
export default function ArticleCoverPicker({
  markdown,
  coverUrl,
  slug,
  onInsert,
  onSelectCover,
  error,
}: ArticleCoverPickerProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const images = extractMarkdownImages(markdown);
  const coverIsStale = coverUrl !== "" && !images.includes(coverUrl);

  async function handleFileChosen(file: File) {
    if (!slug) {
      toast.error("Add a title first — the upload folder is named after it.");
      return;
    }

    setIsUploading(true);
    try {
      const altText = altTextFromFileName(file.name);
      const url = await uploadImage({ target: "articles", slug }, file);

      onInsert(imageMarkdown(url, altText));
      // First image in is almost always the intended cover; still overridable below.
      if (!coverUrl) onSelectCover(url);
      toast.success("Image uploaded and added to the content.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Images & cover
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Uploads are added to the content as markdown. Pick one as the cover
            — an article can't be saved without it.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={isUploading}
          onClick={() => fileInputRef.current?.click()}
          icon={<ImagePlus className="h-4 w-4" />}
          iconPosition="left"
        >
          {isUploading ? "Uploading…" : "Upload image"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFileChosen(file);
          }}
        />
      </div>

      {isUploading && (
        <p className="flex items-center gap-2 text-xs text-text-muted">
          <Spinner className="h-3.5 w-3.5" label="Uploading" />
          Uploading to storage…
        </p>
      )}

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-default px-4 py-6 text-center text-sm text-text-muted">
          No images in this article yet. Upload one to use as the cover.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((url) => {
            const isCover = url === coverUrl;

            return (
              <li key={url}>
                <button
                  type="button"
                  onClick={() => onSelectCover(url)}
                  aria-pressed={isCover}
                  className={`group relative block w-full overflow-hidden rounded-lg border transition-colors duration-200 cursor-pointer ${
                    isCover
                      ? "border-primary-500 ring-1 ring-primary-500"
                      : "border-border-subtle hover:border-border-default"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />

                  <span
                    className={`flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium ${
                      isCover
                        ? "bg-primary-600 text-surface-950"
                        : "bg-surface-900 text-text-muted group-hover:text-text-primary"
                    }`}
                  >
                    <Star
                      className="h-3 w-3"
                      aria-hidden="true"
                      fill={isCover ? "currentColor" : "none"}
                    />
                    {isCover ? "Cover" : "Set as cover"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {coverIsStale && (
        <p className="text-xs text-danger-400">
          The chosen cover is no longer in the content. Pick one of the images
          above.
        </p>
      )}

      {error && <p className="text-xs text-danger-400">{error}</p>}
    </div>
  );
}
