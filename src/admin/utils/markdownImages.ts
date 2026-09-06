/**
 * Matches `![alt](url "optional title")`, capturing the url only. The cover
 * image is picked from these, so the parse has to agree with what the editor
 * inserts and with what the schema validates against.
 */
const IMAGE_PATTERN =
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;

/**
 * An absolute http(s) url (an article saved before the `media://` token
 * scheme existed) or a `media://` token (every upload since). Anything else
 * would surface as a broken thumbnail here and a broken cover on save.
 */
function isUsableImageReference(reference: string): boolean {
  return /^https?:\/\//i.test(reference) || /^media:\/\/[\w\-./]+$/.test(reference);
}

/** Every usable image reference in the markdown body, in order, without duplicates. */
export function extractMarkdownImages(markdown: string | undefined): string[] {
  if (!markdown) return [];

  const references = [...markdown.matchAll(IMAGE_PATTERN)]
    .map((match) => match[1])
    .filter(isUsableImageReference);

  return [...new Set(references)];
}

/** The markdown an upload is appended to the body as. */
export function imageMarkdown(reference: string, altText: string): string {
  return `![${altText}](${reference})`;
}

const MEDIA_TOKEN_PREFIX = "media://";

/**
 * Turns a stored image reference into something an `<img>` can load. A
 * `media://` token needs `mediaBaseUrl` (from `useMediaConfig`) swapped in for
 * its prefix; a legacy real url already loads as-is. Returns `undefined` for
 * a token when `mediaBaseUrl` hasn't loaded yet, so callers can show a
 * placeholder instead of a broken image for that brief window.
 */
export function resolveMediaDisplayUrl(
  reference: string,
  mediaBaseUrl: string | undefined,
): string | undefined {
  if (!reference.startsWith(MEDIA_TOKEN_PREFIX)) return reference;
  if (!mediaBaseUrl) return undefined;

  return `${mediaBaseUrl}/${reference.slice(MEDIA_TOKEN_PREFIX.length)}`;
}

/** Filenames make reasonable default alt text, and stay editable in the body. */
export function altTextFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}
